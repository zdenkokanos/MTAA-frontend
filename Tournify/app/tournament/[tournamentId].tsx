import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, SafeAreaView, ActivityIndicator, TextInput, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import API_BASE_URL from '@/config/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '@/themes/theme';
import iconSet from '@expo/vector-icons/build/Fontisto';

export default function TournamentDetailScreen() {
    const { tournamentId } = useLocalSearchParams();
    const [tournament, setTournament] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState<string | null>(null);
    const [isExpanded, setIsExpanded] = useState(false);
    const [teamsCount, setTeamsCount] = useState<number | null>(null);

    const [selectedOption, setSelectedOption] = useState<"new" | "existing" | null>(null);
    const [teamInput, setTeamInput] = useState("");

    const router = useRouter();

    const handleContinue = async () => {
        if (!selectedOption || !teamInput || !token) return;

        const endpoint = selectedOption === "new"
            ? `${API_BASE_URL}/tournaments/${tournamentId}/register`
            : `${API_BASE_URL}/tournaments/${tournamentId}/join_team`;

        const payload = selectedOption === "new"
            ? { team_name: teamInput }
            : { code: teamInput };

        try {
            const response = await fetch(endpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (response.ok) {
                console.log("Success:", data);
                router.replace({
                    pathname: "/ticket/[ticketId]",
                    params: { ticketId: data.ticketId.toString() },
                });
            } else if (response.status === 400) {
                console.error("Bad Request:", data.message);
                Alert.alert("Error", data.message);
            } else {
                console.error("Error:", data.message);
            }
        } catch (error) {
            console.error("Request failed:", error);
        }
    };

    // Fetch tournament data
    useEffect(() => {
        const fetchTournament = async () => {
            try {
                const storedToken = await AsyncStorage.getItem("token");
                setToken(storedToken);

                const [tournamentRes, teamCountRes] = await Promise.all([
                    fetch(`${API_BASE_URL}/tournaments/${tournamentId}/info`),
                    fetch(`${API_BASE_URL}/tournaments/${tournamentId}/teams/count`, {
                        headers: {
                            Authorization: `Bearer ${storedToken}`,
                            "Content-Type": "application/json",
                        },
                    }),
                ]);

                const tournamentData = await tournamentRes.json();
                const teamCountData = teamCountRes.status !== 204 ? await teamCountRes.json() : {};

                if (tournamentRes.ok) {
                    setTournament(tournamentData);
                } else {
                    console.error('Tournament fetch error:', tournamentData.message);
                }

                if (teamCountRes.ok) {
                    setTeamsCount(teamCountData[0]?.team_count ?? 0);
                } else {
                    console.error('Team count fetch error:', teamCountData.message);
                }
            } catch (err) {
                console.error('Error fetching tournament:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchTournament();
    }, [tournamentId]);

    const theme = useTheme();
    const styles = useMemo(() => getStyles(theme), [theme]);

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    if (!tournament) {
        return (
            <View style={styles.centered}>
                <Text>Failed to load tournament data.</Text>
            </View>
        );
    }

    const daysUntil = Math.ceil((new Date(tournament.date).getTime() - Date.now()) / (1000 * 60 * 60 * 24));

    const shortDescription = tournament.additional_info?.slice(0, 120) ?? '';
    const shouldShowReadMore = tournament.additional_info && tournament.additional_info.length > 120;

    const formattedDate = new Date(tournament.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });

    return (
        <KeyboardAwareScrollView
            style={styles.container}
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
            enableOnAndroid
            extraScrollHeight={40} // Pushes the input above the keyboard
        >
            {/* Image and Back Button */}
            <ScrollView style={styles.container}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={styles.container}
            >
                <View style={styles.imageContainer}>
                    <Image
                        source={{
                            uri: `${API_BASE_URL}/category/images/${tournament.category_image}`,
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

                {/* White Sheet */}
                <View style={styles.sheet}>
                    <View style={styles.swipeBar} />

                    <View style={styles.headerRow}>
                        <Text style={styles.title}>{tournament.tournament_name}</Text>
                        <Ionicons name="share-outline" size={24} style={styles.icons} />
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

                    {/* Team Selection Buttons*/}
                    <View style={styles.teamButtons}>
                        <TouchableOpacity
                            style={[
                                styles.teamButton,
                                selectedOption === "new" && styles.teamButtonSelected,
                            ]}
                            onPress={() => setSelectedOption("new")}
                        >
                            <Text
                                style={selectedOption === "new" ? styles.teamButtonTextSelected : styles.teamsButtonText}
                            >
                                New Team
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[
                                styles.teamButton,
                                selectedOption === "existing" && styles.teamButtonSelected,
                            ]}
                            onPress={() => setSelectedOption("existing")}
                        >
                            <Text style={selectedOption === "existing" ? styles.teamButtonTextSelected : styles.teamsButtonText}>
                                Existing Team
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Input Field */}
                    {selectedOption && (
                        <View style={styles.inputSection}>
                            <Text style={styles.inputLabel}>
                                {selectedOption === "new" ? "Team name" : "Team code"}
                            </Text>
                            <View style={styles.inputBox}>
                                <TextInput
                                    placeholder={
                                        selectedOption === "new"
                                            ? "Enter your team name"
                                            : "Enter your team code"
                                    }
                                    placeholderTextColor="#888"
                                    value={teamInput}
                                    onChangeText={setTeamInput}
                                    style={styles.inputText}
                                />
                                <Ionicons
                                    name={selectedOption === "new" ? "person-add-outline" : "key-outline"}
                                    size={20}
                                    color="#666"
                                />
                            </View>
                        </View>
                    )}

                    {/* Legal Text */}
                    <Text style={styles.legalText}>
                        By clicking the Continue button, you agree to the collection and processing of your personal
                        data for the purpose of tournament registration and management, in accordance with our Privacy Policy.
                    </Text>

                    {/* Continue Button */}
                    <TouchableOpacity
                        style={[
                            styles.continueButton,
                            !selectedOption && styles.continueButtonDisabled,
                        ]}
                        disabled={!selectedOption}
                        onPress={handleContinue}
                    >
                        <Text style={styles.continueText}>Continue</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAwareScrollView >
    );
}

const getStyles = (theme: ReturnType<typeof useTheme>) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.background,
    },
    imageContainer: {
        position: 'relative',
        height: 280,
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
        backgroundColor: theme.background,
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        marginTop: -24,
        paddingHorizontal: 25,
        paddingTop: 20,
        paddingBottom: 40,
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
        color: theme.text,
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
        color: theme.text,
    },
    statLabel: {
        fontSize: 13,
        color: '#666',
        marginTop: 4,
    },
    description: {
        fontSize: 14,
        color: theme.descriptionText,
        marginBottom: 30,
        textAlign: 'justify',
        lineHeight: 20,
        marginTop: 8,
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
        color: theme.text,
    },
    teamButton: {
        flex: 0.48,
        backgroundColor: theme.teamButton,
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
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    safeAreaBack: {
        position: 'absolute',
        top: 50,
        left: 0,
        right: 0,
        zIndex: 10,
    },
    dateUnderTitle: {
        fontSize: 13,
        color: '#999',
        marginBottom: 6,
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
        backgroundColor: theme.inputBackground,
        borderWidth: 1,
        borderColor: theme.inputBorder,
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
    icons: {
        color: theme.text,
    },
    teamsButtonText: {
        color: theme.text,
    },
    inputText: {
        flex: 1,
        color: theme.text,
    },
});

