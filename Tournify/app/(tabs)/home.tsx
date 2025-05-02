import API_BASE_URL from "@/config/config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Text, View, StyleSheet, ScrollView, Image, FlatList, NativeSyntheticEvent, NativeScrollEvent, Dimensions } from "react-native";
import React, { useState, useEffect, useRef } from "react";
import TournamentCard from "@/components/tournamentCard";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import TicketCard from "@/components/ticketCard";
import HistoryCard from "@/components/historyCard";
import { useIsFocused } from '@react-navigation/native';

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

    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [topPicks, setTopPicks] = useState<TopPick[]>([]);
    const [token, setToken] = useState<string | null>(null);
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
    const [tickets, setTickets] = useState<Ticket[]>([]);

    const isFocused = useIsFocused();

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
                console.error("Top Picks error:", topPicksData.message);
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
                console.error("Tickets error:", ticketsData.message);
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
                console.error("History error:", historyData.message);
            }

        } catch (err) {
            console.error("Failed to load home screen data:", err);
        }
    };

    // Initial fetch
    useEffect(() => {
        fetchData();
    }, []);

    // Refetch when screen is focused
    useEffect(() => {
        if (isFocused) {
            fetchData();
        }
    }, [isFocused]);


    const screenWidth = Dimensions.get('window').width;
    const CARD_WIDTH = screenWidth * 0.95;
    const CARD_GAP = 16;
    const [activeIndex, setActiveIndex] = useState(0);
    const flatListRef = useRef<FlatList>(null);

    const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const index = Math.round(event.nativeEvent.contentOffset.x / screenWidth);
        setActiveIndex(index);
    };

    return (
        <SafeAreaView
            style={styles.safeArea}
            edges={['top', 'left', 'right']}
        >
            <ScrollView showsVerticalScrollIndicator={false}>
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
                                    : require("@/images/default-profile.jpg")
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
                        <Ionicons name="notifications-outline" size={24} color="#000" style={styles.bellIcon} />
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
                                <TournamentCard
                                    title={item.tournament_name}
                                    dateText={formatDateRelative(item.date)}
                                    distanceText={`${item.distance} km from you`}
                                    imageUrl={{
                                        uri: `${API_BASE_URL}/category/images/${item.category_image}`,
                                        headers: { Authorization: `Bearer ${token}` },
                                    }}
                                    tournamentId={item.id}
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
                                dateText={formatDateRelative(ticket.date)}
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
                            date={formatDate(item.date)}
                            position={item.position ? formatPosition(item.position) : null}
                            imageUrl={{
                                uri: `${API_BASE_URL}/category/images/${item.category_image}`,
                                headers: {
                                    Authorization: `Bearer ${token}`,
                                },
                            }}
                            onInfoPress={() => console.log("Details for", item.id)}
                        />
                    ))
                ) : (
                    <Text style={styles.emptyText}>No tournament history yet!</Text>
                )}

            </ScrollView>
        </SafeAreaView>
    );

}

function formatDateRelative(dateString: string): string {
    const today = new Date();
    const target = new Date(dateString);

    // Strip time from both dates to compare pure days
    const utcToday = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
    const utcTarget = Date.UTC(target.getFullYear(), target.getMonth(), target.getDate());

    const diffDays = Math.ceil((utcTarget - utcToday) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return "In the past";
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Tomorrow";

    return `in ${diffDays} days`;
}

function formatDate(dateString: string): string {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

function formatPosition(position: number | null): string | null {
    if (position === null || position === undefined) return null;

    const lastDigit = position % 10;
    const lastTwoDigits = position % 100;

    if (lastTwoDigits >= 11 && lastTwoDigits <= 13) {
        return `${position}th place`;
    }

    switch (lastDigit) {
        case 1:
            return `${position}st place`;
        case 2:
            return `${position}nd place`;
        case 3:
            return `${position}rd place`;
        default:
            return `${position}th place`;
    }
}

const styles = StyleSheet.create({
    safeArea: {
        backgroundColor: "#fff",
        minHeight: '100%'
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
    },
    level: {
        fontSize: 13,
        color: "gray",
        marginTop: 2,
    },
    bellIcon: {
        marginLeft: "auto",
        marginRight: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: "bold",
        margin: 20,
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
        color: "#999",
        fontStyle: "italic",
        marginRight: 20,
        marginBottom: 10,
        marginLeft: 20,
        backgroundColor: "#eee",
        borderRadius: 10,
    },
    // Dots
    dotsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 12,
    },
    dot: {
        fontSize: 10,
        marginHorizontal: 4,
    },
    activeDot: {
        color: '#000',
    },
    inactiveDot: {
        color: '#ccc',
    },

});
