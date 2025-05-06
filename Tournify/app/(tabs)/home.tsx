import API_BASE_URL from "@/config/config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Text, View, StyleSheet, ScrollView, FlatList, Image, NativeSyntheticEvent, NativeScrollEvent, Dimensions, RefreshControl } from "react-native";
import React, { useState, useEffect, useRef, useMemo } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import TicketCard from "@/components/home/ticketCard";
import HistoryCard from "@/components/home/historyCard";
import { useIsFocused } from '@react-navigation/native';
import { useTheme } from "@/themes/theme";
import { router } from "expo-router";
import OfflineBanner from "@/components/offline/offlineBanner";
import TournamentView from "@/components/explore/tournamentView";
import { cacheAllTickets } from "@/utils/cacheTickets";
import { useOnShakeRefresh } from '@/hooks/useOnShakeRefresh';
import useLocation from '@/hooks/useLocation';

export default function HomeScreen() {

    interface UserInfo {
        first_name: string;
        last_name: string;
        image_path: string | null;
    }
    interface TopPick {
        tournament_name: string;
        date: string;
        distance: number;
        category_image: string;
        id: string;
    }
    interface Ticket {
        date: string;
        category_image: string;
        id: string;
    }
    interface HistoryItem {
        id: string;
        tournament_name: string;
        date: string;
        position: number;
        category_image: string;
    }

    const { latitude, longitude, error, getUserLocation } = useLocation();
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [topPicks, setTopPicks] = useState<TopPick[]>([]);
    const [token, setToken] = useState<string | null>(null);
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
    const [tickets, setTickets] = useState<Ticket[]>([]);

    const isFocused = useIsFocused(); //automatically updates when the screen is focused

    const fetchData = async () => {
        try {
            const storedToken = await AsyncStorage.getItem("token");
            const storedUserId = await AsyncStorage.getItem("userId");

            if (!storedUserId || !storedToken) return;

            setToken(storedToken);

            // Fetch Top Picks
            const topPicksResponse = await fetch(`${API_BASE_URL}/users/${storedUserId}/top-picks`, {
                headers: {
                    Authorization: `Bearer ${storedToken}`,
                    "Content-Type": "application/json",
                },
            });
            const topPicksData = await topPicksResponse.json();
            if (topPicksResponse.ok) {
                setTopPicks(topPicksData);
            } else {
                console.warn("Top Picks error:", topPicksData.message);
            }

            // Fetch User Info
            const userInfoResponse = await fetch(`${API_BASE_URL}/users/${storedUserId}/info`, {
                headers: {
                    Authorization: `Bearer ${storedToken}`,
                    "Content-Type": "application/json",
                },
            });
            const userInfoData = await userInfoResponse.json();
            if (userInfoResponse.ok) {
                setUserInfo(userInfoData);
            } else {
                console.error("User Info error:", userInfoData.message);
            }

            // Fetch Tickets
            const ticketsResponse = await fetch(`${API_BASE_URL}/users/${storedUserId}/tickets`, {
                headers: {
                    Authorization: `Bearer ${storedToken}`,
                    "Content-Type": "application/json",
                },
            });

            const ticketsData = await ticketsResponse.json();
            if (ticketsResponse.ok) {
                setTickets(ticketsData);
            } else {
                console.warn("Tickets error:", ticketsData.message);
            }

            // Fetch History
            const historyResponse = await fetch(`${API_BASE_URL}/users/${storedUserId}/tournaments/history`, {
                headers: {
                    Authorization: `Bearer ${storedToken}`,
                    "Content-Type": "application/json",
                },
            });

            const historyData = await historyResponse.json();
            if (historyResponse.ok) {
                setHistory(historyData);
            } else {
                console.warn("History error:", historyData.message);
            }

            // Cache Tickets for Offline use
            await cacheAllTickets();

        } catch (err) {
            console.error("Failed to load home screen data:", err);
        }
    };

    // Initial fetch
    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        getUserLocation();
    }, []);


    // Refresh control for pull-to-refresh
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchData();
        setRefreshing(false);
    };

    useOnShakeRefresh(onRefresh);

    // Refetch when screen is focused
    useEffect(() => {
        if (isFocused) {
            fetchData();
        }
    }, [isFocused]);

    const screenWidth = Dimensions.get('window').width;
    const CARD_WIDTH = screenWidth * 0.95;
    const CARD_GAP = 16;
    const [activeIndex, setActiveIndex] = useState(0); // State to track the active index of the FlatList
    const flatListRef = useRef<FlatList>(null);

    const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const index = Math.round(event.nativeEvent.contentOffset.x / screenWidth);
        setActiveIndex(index);
    }; // Function to handle the scroll event and update the active index

    // Variable to store the theme styles
    const theme = useTheme();
    const styles = useMemo(() => getStyles(theme), [theme]);

    return (
        <SafeAreaView
            style={styles.safeArea}
            edges={['top', 'left', 'right']}
        >
            <OfflineBanner />
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 40 }}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                <View style={styles.header}>
                    <View style={styles.profileRow}>
                        <Image
                            source={
                                userInfo && userInfo.image_path !== "null" && userInfo.image_path && token
                                    ? {
                                        uri: `${API_BASE_URL}/uploads/${userInfo.image_path}`,
                                        headers: {
                                            Authorization: `Bearer ${token}`,
                                        },
                                    }
                                    : require("@/assets/images/default-profile.jpg")
                            }
                            style={styles.avatar}
                            onError={(error) => {
                                console.log("Image failed to load:", error.nativeEvent.error);
                            }}
                        />
                        <View>
                            <Text style={styles.name}>
                                {userInfo ? `${userInfo.first_name} ${userInfo.last_name}` : "Loading..."}
                            </Text>
                            <Text style={styles.level}>Intermediate</Text>
                        </View>
                        <Ionicons name="notifications-outline" size={24} style={styles.bellIcon} />
                    </View>

                </View>

                <Text style={styles.sectionTitle}>Top Picks</Text>
                {topPicks.length > 0 ? (
                    <FlatList
                        ref={flatListRef}
                        data={topPicks}
                        horizontal
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <View style={{ width: CARD_WIDTH, marginRight: CARD_GAP }}>
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
                    {topPicks.map((_, index) => (
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
                {/* Tickets */}
                <Text style={styles.sectionTitle}>Tickets</Text>
                {tickets.length > 0 ? (
                    <ScrollView
                        contentContainerStyle={styles.horizontalList}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                    >
                        {tickets.map((ticket) => (
                            <TicketCard
                                key={ticket.id}
                                ticketId={ticket.id}
                                date={ticket.date}
                                imageUrl={{
                                    uri: `${API_BASE_URL}/category/images/${ticket.category_image}`,
                                    headers: {
                                        Authorization: `Bearer ${token}`,
                                    },
                                }}
                            />
                        ))}
                    </ScrollView>
                ) : (
                    <Text style={styles.emptyText}>You have no tickets yet.</Text>
                )}
                {/* History */}
                <Text style={styles.sectionTitle}>History</Text>
                {history.length > 0 ? (
                    history.map((item) => (
                        <HistoryCard
                            key={item.id}
                            title={item.tournament_name}
                            date={item.date}
                            position={item.position ? formatPosition(item.position) : null}
                            imageUrl={{
                                uri: `${API_BASE_URL}/category/images/${item.category_image}`,
                                headers: {
                                    Authorization: `Bearer ${token}`,
                                },
                            }}
                            onInfoPress={() => router.push({
                                pathname: `/history/${item.id}`,
                                params: { position: item.position ? formatPosition(item.position) : null },
                            })}
                        />
                    ))
                ) : (
                    <Text style={styles.emptyText}>No tournament history yet!</Text>
                )}

            </ScrollView>
        </SafeAreaView>
    );

}

const formatPosition = (n: number) => { // Generated by OpenAI
    const s = ['th', 'st', 'nd', 'rd'];
    const v = n % 100;
    const position = n + (s[(v - 20) % 10] || s[v] || s[0])
    return `${position} place`;
};

const getStyles = (theme: ReturnType<typeof useTheme>) => StyleSheet.create({
    safeArea: {
        backgroundColor: theme.background,
        minHeight: '100%',
    },
    header: {
        marginTop: 20,
        paddingHorizontal: 16,
        paddingTop: 12,
        paddingBottom: 10,
    },
    profileRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 12,
    },
    name: {
        fontSize: 16,
        fontWeight: "bold",
        color: theme.text,
    },
    level: {
        fontSize: 13,
        color: theme.mutedText,
        marginTop: 2,
    },
    bellIcon: {
        marginLeft: "auto",
        marginRight: 20,
        color: theme.text,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: "bold",
        margin: 20,
        color: theme.text,
    },
    scrollContainer: {
        paddingHorizontal: 16,
        flexDirection: "row",
        gap: 16,
    },
    horizontalList: {
        paddingLeft: 16,
        gap: 16,
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
