import API_BASE_URL from "@/config/config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Text, View, StyleSheet, ScrollView, Image } from "react-native";
import React, { useState, useEffect } from "react";
import TournamentCard from "@/components/tournamentCard";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import TicketCard from "@/components/ticketCard";
import HistoryCard from "@/components/historyCard";

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


    const [topPicks, setTopPicks] = useState<TopPick[]>([]);
    const [token, setToken] = useState<string | null>(null);
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
    const [tickets, setTickets] = useState<Ticket[]>([]);

    useEffect(() => {
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

            } catch (err) {
                console.error("Failed to load home screen data:", err);
            }
        };

        fetchData();
    }, []);


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
                                userInfo && userInfo.image_path !== "null" && token
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
                <ScrollView
                    contentContainerStyle={styles.scrollContainer}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                >
                    {topPicks.map((item, index) => (
                        <TournamentCard
                            key={index}
                            title={item.tournament_name}
                            dateText={formatDateRelative(item.date)}
                            distanceText={`${item.distance} km from you`}
                            imageUrl={{
                                uri: `${API_BASE_URL}/uploads/${item.category_image}`,
                                headers: {
                                    Authorization: `Bearer ${token}`,
                                },
                            }}
                            onInfoPress={() => console.log("Show info for", item.id)}
                        />
                    ))}
                </ScrollView>
                {/* Tickets */}
                <Text style={styles.sectionTitle}>Tickets</Text>
                <ScrollView
                    contentContainerStyle={styles.horizontalList}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                >
                    {tickets.map((ticket) => (
                        <TicketCard
                            key={ticket.id}
                            dateText={formatDateRelative(ticket.date)}
                            imageUrl={{
                                uri: `${API_BASE_URL}/uploads/${ticket.category_image}`,
                                headers: {
                                    Authorization: `Bearer ${token}`,
                                },
                            }}
                        />
                    ))}
                    <TicketCard
                        dateText="in 15 days"
                        imageUrl={require("@/images/tennis.jpg")}
                    />
                    <TicketCard
                        dateText="in 6 days"
                        imageUrl={require("@/images/badminton.jpg")}
                    />
                </ScrollView>
                <Text style={styles.sectionTitle}>History</Text>
                <HistoryCard
                    title="Tennis tournament"
                    date="14th April 2024"
                    position="1st place"
                    imageUrl={require("@/images/tennis.jpg")}
                    onInfoPress={() => console.log("Details")}
                />
                <HistoryCard
                    title="Badminton tournament"
                    date="20th March 2024"
                    position="2nd place"
                    imageUrl={require("@/images/badminton.jpg")}
                    onInfoPress={() => console.log("Details")}
                />
            </ScrollView>
        </SafeAreaView>
    );

}

function formatDateRelative(dateString: string): string {
    const today = new Date();
    const target = new Date(dateString);
    const diff = Math.ceil((+target - +today) / (1000 * 60 * 60 * 24));
    return diff <= 0 ? "Today" : `in ${diff} days`;
}

const styles = StyleSheet.create({
    safeArea: {
        backgroundColor: "#fff",
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
});
