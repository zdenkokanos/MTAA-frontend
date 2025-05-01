import { View, Text, StyleSheet, SafeAreaView, ScrollView, ActivityIndicator, Image, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Toast from 'react-native-toast-message';
import React, { useEffect, useState } from 'react';
import QRCode from 'react-native-qrcode-svg';
import API_BASE_URL from '@/config/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';

export default function TicketDetailScreen() {
    const { ticketId } = useLocalSearchParams();
    const [loading, setLoading] = useState(true);
    const [ticket, setTicket] = useState<any>(null);
    const [token, setToken] = useState<string | null>(null);
    const [tournament, setTournament] = useState<any>(null);
    const [isExpanded, setIsExpanded] = useState(false);
    const [teamsCount, setTeamsCount] = useState<number | null>(null);
    const [enrolledTeams, setEnrolledTeams] = useState([]);



    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = await AsyncStorage.getItem("token");
                const userId = await AsyncStorage.getItem("userId");

                setToken(token);

                // Fetch the ticket info
                const ticketRes = await fetch(`${API_BASE_URL}/users/${userId}/tickets/${ticketId}/qr`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const ticketData = await ticketRes.json();
                const ticketInfo = ticketData[0];
                setTicket(ticketInfo);

                // If ticket is valid, fetch tournament + team count
                if (ticketInfo?.tournament_id) {
                    const [tournamentRes, teamCountRes] = await Promise.all([
                        fetch(`${API_BASE_URL}/tournaments/${ticketInfo.tournament_id}/info`),
                        fetch(`${API_BASE_URL}/tournaments/${ticketInfo.tournament_id}/teams/count`, {
                            headers: {
                                Authorization: `Bearer ${token}`,
                                "Content-Type": "application/json",
                            },
                        }),
                    ]);

                    const tournamentData = await tournamentRes.json();
                    const teamCountData = teamCountRes.status !== 204 ? await teamCountRes.json() : [];

                    if (tournamentRes.ok) {
                        setTournament(tournamentData);
                    }

                    if (teamCountRes.ok) {
                        setTeamsCount(teamCountData[0]?.team_count ?? 0);
                    } else {
                        setTeamsCount(0); // fallback for 204
                    }
                }

                const enrolledRes = await fetch(`${API_BASE_URL}/tournaments/${ticketInfo.tournament_id}/enrolled`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const enrolledData = await enrolledRes.json();
                if (enrolledRes.ok) {
                    setEnrolledTeams(enrolledData);
                } else {
                    console.error("Failed to fetch enrolled teams:", enrolledData.message);
                }
            } catch (err) {
                console.error("Error loading data:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [ticketId]);


    if (loading) {
        return <View style={styles.centered}><ActivityIndicator size="large" /></View>;
    }

    if (!ticket || !tournament) {
        return <View style={styles.centered}><Text>Failed to load data.</Text></View>;
    }

    const shortDescription = tournament.additional_info?.slice(0, 120) ?? '';
    const shouldShowReadMore = tournament.additional_info && tournament.additional_info.length > 120;

    const daysUntil = Math.ceil((new Date(tournament.date).getTime() - Date.now()) / (1000 * 60 * 60 * 24));

    const formattedDate = new Date(tournament.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });

    return (
        <View style={{ flex: 1 }}>
            <View style={styles.imageContainer}>
                <Image
                    source={{
                        uri: `${API_BASE_URL}/uploads/${tournament.category_image}`,
                        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
                    }}
                    style={styles.image}
                />
                <SafeAreaView style={styles.safeAreaBack}>
                    <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                        <Ionicons name="arrow-back" size={24} color="white" />
                    </TouchableOpacity>
                </SafeAreaView>
            </View>

            <ScrollView style={styles.sheet}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={{ backgroundColor: '#fff', flexGrow: 1 }}
                showsVerticalScrollIndicator={false}
            >
                {/* White Sheet */}
                <View style={styles.swipeBar} />
                <View style={styles.qrWrapper}>
                    <QRCode value={ticket.ticket} size={180} />
                </View>

                <Text style={{ textAlign: "center", marginTop: 5 }}>Code for other members:</Text>
                <TouchableOpacity
                    onPress={async () => {
                        try {
                            await Clipboard.setStringAsync(ticket.code);
                            Toast.show({
                                type: 'success',
                                text1: 'Code copied!',
                                position: 'top',
                                visibilityTime: 1500,
                            });
                            console.log('Code copied to clipboard:', ticket.code);
                        } catch (error) {
                            console.error('Clipboard operation failed:', error);
                        }
                    }}
                >
                    <Text style={styles.teamCodeCopy}>{ticket.code}</Text>
                </TouchableOpacity>

                <View style={styles.headerRow}>
                    <Text style={styles.title}>{tournament.tournament_name}</Text>
                    <Text style={styles.joinedText}>{teamsCount ?? "0"} joined</Text>
                </View>

                <Text style={styles.dateUnderTitle}>{formattedDate}</Text>

                {/* Stats */}
                <View style={styles.statsRow}>
                    <View style={styles.stat}>
                        <Text style={styles.statNumber}>{teamsCount ?? "0"}</Text>
                        <Text style={styles.statLabel}>joined</Text>
                    </View>
                    <View style={styles.stat}>
                        <Text style={styles.statNumber}>{tournament.max_team_size}</Text>
                        <Text style={styles.statLabel}>team size</Text>
                    </View>
                    <View style={styles.stat}>
                        <Text style={styles.statNumber}>{daysUntil}</Text>
                        <Text style={styles.statLabel}>days until</Text>
                    </View>
                </View>

                {/* Description */}
                <Text style={styles.description}>
                    {tournament.additional_info
                        ? isExpanded || !shouldShowReadMore
                            ? tournament.additional_info
                            : shortDescription + '...'
                        : 'No description available.'}
                    {shouldShowReadMore && (
                        <>
                            {'   '}
                            <Text
                                style={[
                                    styles.readMoreInline,
                                    isExpanded ? styles.readMoreLess : styles.readMoreMore,
                                ]}
                                onPress={() => setIsExpanded(prev => !prev)}
                            >
                                {isExpanded ? 'Show less' : 'Read more'}
                            </Text>
                        </>
                    )}
                </Text>

                {tournament.latitude && tournament.longitude && (
                    <MapView
                        style={styles.map}
                        initialRegion={{
                            latitude: tournament.latitude,
                            longitude: tournament.longitude,
                            latitudeDelta: 0.01,
                            longitudeDelta: 0.01,
                        }}
                        scrollEnabled={false}
                        zoomEnabled={false}
                        pitchEnabled={false}
                        rotateEnabled={false}
                    >
                        <Marker
                            coordinate={{
                                latitude: tournament.latitude,
                                longitude: tournament.longitude,
                            }}
                            title={tournament.tournament_name}
                        />
                    </MapView>
                )}

                <Text style={styles.enrolledTitle}>Enrolled Teams</Text>
                <View style={styles.table}>
                    <View style={styles.tableRow}>
                        <Text style={[styles.tableCell, styles.headerCell]}>Team name</Text>
                        <Text style={[styles.tableCell, styles.headerCell]}>Members</Text>
                    </View>
                    {enrolledTeams.map((team: any, index: number) => (
                        <View key={index} style={styles.tableRow}>
                            <Text style={styles.tableCell}>{team.team_name}</Text>
                            <Text style={styles.tableCell}>{team.number_of_members}</Text>
                        </View>
                    ))}
                </View>
            </ScrollView >
        </View >
    );
}

const styles = StyleSheet.create({
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    joinedText: {
        color: '#007AFF',
        fontSize: 13,
    },
    description: {
        fontSize: 14,
        color: '#444',
        marginBottom: 16,
        lineHeight: 20,
    },
    map: {
        width: '100%',
        height: 180,
        borderRadius: 12,
        marginBottom: 24,
        backgroundColor: '#eee',
    },
    enrolledTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    table: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        overflow: 'hidden',
    },
    tableRow: {
        flexDirection: 'row',
        backgroundColor: '#fff',
    },
    tableCell: {
        flex: 1,
        padding: 10,
        fontSize: 14,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    headerCell: {
        fontWeight: 'bold',
        backgroundColor: '#f5f5f5',
    },

    //this is from other file
    imageContainer: {
        position: 'relative',
        height: 150,
        zIndex: 1,
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    backButton: {
        position: 'absolute',
        top: 16,
        left: 16,
        backgroundColor: 'rgba(0,0,0,0.5)',
        padding: 10,
        borderRadius: 25,
    },
    sheet: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        marginTop: -24,
        paddingHorizontal: 25,
        paddingTop: 20,
        paddingBottom: 40,
        position: 'relative',   // 👈 required to respect zIndex
        zIndex: 2,
    },
    swipeBar: {
        width: 60,
        height: 5,
        backgroundColor: '#ccc',
        borderRadius: 2.5,
        alignSelf: 'center',
        marginBottom: 16,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 5,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#000',
        flexShrink: 1,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 24,
    },
    stat: {
        alignItems: 'center',
        flex: 1,
    },
    statNumber: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#000',
    },
    statLabel: {
        fontSize: 13,
        color: '#666',
        marginTop: 4,
    },
    readMoreInline: {
        fontWeight: 'bold',
        marginLeft: 4,
        textDecorationLine: 'underline',
    },
    readMoreMore: {
        color: '#007AFF', // blue
    },
    readMoreLess: {
        color: '#999', // gray
    },
    teamButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 24,
    },
    teamButton: {
        flex: 0.48,
        backgroundColor: '#f0f0f0',
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: 'center',
    },
    legalText: {
        fontSize: 12,
        color: '#999',
        marginBottom: 20,
        textAlign: 'justify',
        lineHeight: 18,
    },
    continueButton: {
        backgroundColor: '#38b381',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    continueButtonDisabled: {
        backgroundColor: 'rgba(56, 179, 129, 0.4)'
    },
    continueText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    safeAreaBack: {
        position: 'absolute',
        top: 50,
        left: 0,
        right: 0,
    },
    dateUnderTitle: {
        fontSize: 13,
        color: '#999',
        marginBottom: 6,
    },
    qrWrapper: {
        alignItems: 'center',
        marginVertical: 20,
    },
    teamCodeCopy: {
        fontSize: 20,
        fontWeight: '600',
        color: '#007AFF',
        textAlign: 'center',
        marginVertical: 10,
    },
    // Input styles
    inputSection: {
        marginBottom: 24,
    },
    inputLabel: {
        fontSize: 14,
        color: "#444",
        marginBottom: 6,
    },
    inputBox: {
        backgroundColor: "#f0f0f0",
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        flexDirection: "row",
        alignItems: "center",
    },
    teamButtonSelected: {
        backgroundColor: "#38b381",
    },
    teamButtonTextSelected: {
        color: "#fff",
        fontWeight: "bold",
    },
});
