import OfflineBanner from "@/components/offline/offlineBanner";
import { useEffect, useMemo, useRef, useState } from "react";
import { Text, View, StyleSheet, Platform, RefreshControl, ScrollView, FlatList, Dimensions, NativeSyntheticEvent, NativeScrollEvent } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@/themes/theme";
import API_BASE_URL from "@/config/config";

import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import TournamentView from "@/components/explore/tournamentView";
import useLocation from "@/hooks/useLocation";

export default function WelcomeScreen() {

    // Refresh control for pull-to-refresh
    const [refreshing, setRefreshing] = useState(false);
    const [hostedTournaments, setHostedTournaments] = useState([]);
    const [registeredTournaments, setRegisteredTournaments] = useState([]);
    const { latitude, longitude, error, getUserLocation } = useLocation();

    const fetchData = async () => {
        const userToken = await AsyncStorage.getItem("token");
        const userId = await AsyncStorage.getItem("userId");
        if (!userId || !userToken) return;
        
        try {
            // Hosted tournaments
            const hostedResult = await fetch(`${API_BASE_URL}/users/${userId}/tournaments/owned`, {
                headers: { Authorization: `Bearer ${userToken}` },
            });
            
            const hostedData = await hostedResult.json();
            if(hostedResult.ok) setHostedTournaments(hostedData);
            
            
            // Registered tournaments
            const registeredResult = await fetch(`${API_BASE_URL}/users/${userId}/tournaments`, {
                headers: { Authorization: `Bearer ${userToken}` },
            });
            
            const registeredData = await registeredResult.json();
            if(registeredResult.ok) setRegisteredTournaments(registeredData);
            
            
            
        } catch (err) {
            console.error("EventsScreen fetch error:", err);
        }
    };
    
    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        getUserLocation();
    }, []);

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchData();
        setRefreshing(false);
    };

    const theme = useTheme();
    const styles = useMemo(() => getStyles(theme), [theme]);

    
    const screenWidth = Dimensions.get('window').width;
    const CARD_WIDTH = screenWidth * 0.95;
    const CARD_GAP = 16;
    const flatListRef = useRef<FlatList>(null);
    const [activeIndex, setActiveIndex] = useState(0); // State to track the active index of the FlatList

    const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const index = Math.round(event.nativeEvent.contentOffset.x / screenWidth);
        setActiveIndex(index);
    }; // Function to handle the scroll event and update the active index



    return (
        <SafeAreaView style={styles.safeArea} >
            
            <OfflineBanner />
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 40 }}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                
            {/* Hosted tournaments */}
            <View>
                <View style={styles.mainTitle}>
                    <MaterialCommunityIcons style={styles.icon} name="hammer-wrench" size={28} color={theme.text} />
                    <Text style={styles.title}>Hosted Tournaments</Text>
                </View>

                <Text style={styles.sectionTitle}>You are hosting these tournaments: </Text>
                {hostedTournaments.length > 0 ? (
                    <FlatList
                        ref={flatListRef}
                        data={hostedTournaments}
                        horizontal
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <View style={{ width: CARD_WIDTH, marginRight: CARD_GAP }}>
                                <TournamentView
                                    title={item.tournament_name}
                                    date={item.date}
                                    imageUrl={{ uri: `${API_BASE_URL}/category/images/${item.category_image}` }}
                                    tournamentId={item.id}
                                    lat={null}
                                    lon={null}
                                    userLat={null}
                                    userLon={null}
                                    defaultDistance={item.distance}
                                />
                            </View>
                        )}
                        showsHorizontalScrollIndicator={false}
                        pagingEnabled={false} // must be false for snapToInterval to work
                        snapToAlignment="start"
                        snapToInterval={CARD_WIDTH + CARD_GAP}
                        decelerationRate="fast"
                        onScroll={handleScroll}
                        scrollEventThrottle={16}
                        contentContainerStyle={{
                            paddingHorizontal: (screenWidth - CARD_WIDTH) / 2,
                        }}
                    />
                ) : (
                    <Text style={styles.emptyText}>No top picks found.</Text>
                )}
                <View style={styles.dotsContainer}>
                    {hostedTournaments.map((_, index) => (
                        <Text
                            key={index}
                            style={[
                                styles.dot,
                                index === activeIndex ? styles.activeDot : styles.inactiveDot,
                            ]}
                        >
                            ●
                        </Text>
                    ))}
                </View>
            </View>



            {/* Upcomming tournaments */}
            <View>
                <View style={styles.mainTitle}>
                    <AntDesign name="Trophy" style={styles.icon} size={25} color={theme.text} />
                    <Text style={styles.title}>Upcoming events</Text>
                </View>
            </View>


            </ScrollView>

        </SafeAreaView>
    );
}


const getStyles = (theme: ReturnType<typeof useTheme>) => StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: theme.background,
        paddingTop: Platform.OS === 'ios' ? 0 : 40,
    },
    mainTitle: {
        flexDirection: 'row',
        textAlignVertical: 'center',
        marginTop: 20,
        marginLeft: 25,
    },
    title: {
        fontSize: 25,
        fontWeight: 'bold',
        marginBottom: 25,
        color: theme.text,
    },
    icon: {
        marginTop: 2,
        marginRight: 10,
        color: theme.text,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: "bold",
        margin: 20,
        color: theme.text,
    },
    emptyText: {
        padding: 20,
        fontSize: 14,
        color: theme.mutedText,
        fontStyle: "italic",
        marginRight: 20,
        marginBottom: 10,
        marginLeft: 20,
        backgroundColor: theme.card,
        borderRadius: 10,
    },
    dotsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 12,
    },
    dot: {
        fontSize: 10,
        marginHorizontal: 4,
        color: theme.dotInactive,
    },
    activeDot: {
        color: theme.dotActive,
    },
    inactiveDot: {
        color: theme.dotInactive,
    },
});
