import { useLocalSearchParams } from 'expo-router';
import { View, Text, StyleSheet, FlatList, SafeAreaView, Platform, RefreshControl, ActivityIndicator } from 'react-native';
import { useEffect, useMemo, useState } from 'react';
import API_BASE_URL from '@/config/config';
import useLocation from '@/hooks/useLocation';

import TournamentView from '@/components/explore/tournamentView'
import { useTheme } from "@/themes/theme";
import LottieView from 'lottie-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import OfflineBanner from '@/components/offline/offlineBanner';
import useOnShakeRefresh from '@/hooks/useOnShakeRefresh';

export default function CategoryTournamentsScreen() {
    const { latitude, longitude, error, getUserLocation } = useLocation();
    const { category } = useLocalSearchParams<{ category: string }>();
    const [tournaments, setTournaments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const categoryParts = category?.split('-');
    const categoryId = categoryParts?.[0];
    const categoryName = categoryParts?.slice(1).join(' ');

    // TODO:
    // GPSko, search

    const fetchTournaments = async () => {

        const userId = await AsyncStorage.getItem("userId");

        try {
            const response = await fetch(`${API_BASE_URL}/tournaments?category_id=${categoryId}&user_id=${userId}`);
            const data = await response.json();

            setTournaments(Array.isArray(data) ? data : []);

        } catch (error) {
            console.error('Error loading tournaments:', error);
            setTournaments([]); // fallback 
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTournaments();
    }, [categoryId]);

    useEffect(() => {
        getUserLocation();
    }, []);


    const theme = useTheme();
    const styles = useMemo(() => getStyles(theme), [theme]);

    // Refresh control for the FlatList
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchTournaments();
        setRefreshing(false);
    };

    useOnShakeRefresh(onRefresh);


    return (
        <SafeAreaView
            style={styles.safeArea}
        >
            <OfflineBanner />
            <View style={styles.container}>
                <Text style={styles.title}>Tournaments for <Text style={styles.titleSport}>{categoryName}</Text> </Text>
                {loading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="gray" />
                    </View>
                ) : tournaments.length === 0 ? (
                    <View style={styles.animationContainer}>
                        <LottieView
                            source={require('@/assets/animations/notFound.json')}
                            autoPlay
                            loop={true}
                            style={styles.animation}
                        />
                        <Text style={styles.emptyText}>Sorry, no tournaments found.</Text>
                    </View>
                ) : (
                    <>
                        <View style={styles.GPSinfo}>
                            {latitude != 0 ? (
                                <Text style={styles.GPSinfoText}>(Tournify is using your current location)</Text>
                            ) : (
                                <Text style={styles.GPSinfoText}>(Tournify is using your prefered location from profile)</Text>
                            )}
                        </View>
                        <FlatList
                            data={tournaments}
                            keyExtractor={(item) => item.id.toString()}
                            showsVerticalScrollIndicator={false}
                            refreshControl={
                                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                            }
                            renderItem={({ item }) => (
                                <View>
                                    <TournamentView
                                        title={item.tournament_name}
                                        date={item.date}
                                        imageUrl={{ uri: `${API_BASE_URL}/category/images/${item.category_image}` }}
                                        tournamentId={item.id}
                                        lat={item.latitude}
                                        lon={item.longitude}
                                        userLat={latitude}
                                        userLon={longitude}
                                        defaultDistance={item.distance}
                                    />
                                </View>
                            )}
                            contentContainerStyle={{ paddingBottom: 20 }}
                        />
                    </>
                )}
            </View>
        </SafeAreaView>
    );

};

const getStyles = (theme: ReturnType<typeof useTheme>) => StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: theme.background,
        paddingTop: Platform.OS === 'ios' ? 0 : 40,
    },
    container: { flex: 1, padding: 15 },
    title: {
        fontSize: 24,
        fontWeight: 700,
        marginBottom: 20,
        color: theme.text,
    },
    titleSport: {
        textTransform: 'capitalize',
        fontWeight: 900
    },
    card: {
        padding: 16,
        backgroundColor: '#eee',
        marginBottom: 10,
        borderRadius: 8
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '600'
    },
    cardInfo: {
        fontSize: 14,
        color: '#555'
    },
    emptyText: {
        textAlign: 'center',
        fontSize: 16,
        color: theme.text,
        fontStyle: 'italic',
    },
    animationContainer: {
        marginTop: 50,
        alignItems: 'center'
    },
    animation: {
        width: '90%',
        height: 200,
    },
    GPSinfo: {
        alignItems: 'center',
        marginBottom: 15,
    },
    GPSinfoText: {
        color: '#999'
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 40,
    },
});