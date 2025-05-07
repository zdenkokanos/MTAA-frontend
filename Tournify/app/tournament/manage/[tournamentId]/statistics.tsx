import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, KeyboardAvoidingView, Platform, TextInput } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import DropDownPicker from 'react-native-dropdown-picker';
import StartButton from '@/components/startButton';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import API_BASE_URL from '@/config/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '@/themes/theme';

function getOrdinal(n: number) {
    const s = ["th", "st", "nd", "rd"],
        v = n % 100;
    return s[(v - 20) % 10] || s[v] || s[0];
}

export default function EditLeaderboardScreen() {
    const insets = useSafeAreaInsets();
    const [status, setStatus] = useState('Ongoing');
    const [open, setOpen] = useState(false);
    const [items, setItems] = useState([
        { label: 'Ongoing', value: 'Ongoing' },
        { label: 'Closed', value: 'Closed' },
        { label: 'Suspended', value: 'Suspended' },
    ]);
    const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
    const inputRefs = useRef<(TextInput | null)[]>([]);
    const [joinedTeams, setJoinedTeams] = useState<{ id: number; team_name: string }[]>([]);
    const [teamInputs, setTeamInputs] = useState<string[]>([]);
    const [suggestions, setSuggestions] = useState<{ id: number; team_name: string }[]>([]);

    const { tournamentId } = useLocalSearchParams();

    useEffect(() => {
        const fetchData = async () => {
            const storedToken = await AsyncStorage.getItem('token');
            if (!storedToken) {
                console.error('Token not found');
                return;
            }
            try {
                // Fetch enrolled teams
                const enrolledRes = await fetch(`${API_BASE_URL}/tournaments/${tournamentId}/enrolled`, {
                    headers: { Authorization: `Bearer ${storedToken}` },
                });

                // Fetch existing leaderboard
                const leaderboardRes = await fetch(`${API_BASE_URL}/tournaments/${tournamentId}/leaderboard`, {
                    headers: { Authorization: `Bearer ${storedToken}` },
                });

                if (!enrolledRes.ok || !leaderboardRes.ok) {
                    throw new Error('Failed to fetch data');
                }

                const enrolledData = await enrolledRes.json();
                const leaderboardData = await leaderboardRes.json();

                const teams = enrolledData.teams || enrolledData;
                setJoinedTeams(teams);
                setSuggestions(teams);

                const teamMap = Object.fromEntries(teams.map((t: { id: number; team_name: string }) => [t.id, t.team_name]));

                const prefilledInputs: string[] = [];
                leaderboardData.forEach((entry: any, i: number) => {
                    prefilledInputs[entry.position - 1] = teamMap[entry.team_id] || '';
                });

                // Fill remaining with empty strings if needed
                while (prefilledInputs.length < teams.length) {
                    prefilledInputs.push('');
                }

                setTeamInputs(prefilledInputs);

            } catch (err) {
                console.error('Error loading leaderboard data:', err);
            }
        };

        if (tournamentId) fetchData();
    }, [tournamentId]);


    const theme = useTheme();
    const styles = useMemo(() => getStyles(theme), [theme]);

    const handleSubmit = async () => {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
            console.error('Token not found');
            return;
        }

        // Match input names to actual team IDs
        const teamNameToId = Object.fromEntries(joinedTeams.map(team => [team.team_name, team.id]));

        const requests = teamInputs.map((name, index) => {
            const trimmedName = name.trim();
            const teamId = teamNameToId[trimmedName];

            if (!trimmedName || !teamId) return null;

            return fetch(`${API_BASE_URL}/tournaments/leaderboard/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    tournament_id: tournamentId,
                    team_id: teamId,
                    position: index + 1,
                }),
            });
        }).filter(Boolean);

        try {
            const results = await Promise.all(requests);
            const failed = results.filter((res): res is Response => res !== null && !res.ok);

            if (failed.length > 0) {
                console.error(`${failed.length} records failed to submit.`);
            } else {
                console.log('All records submitted successfully');
                router.back();
            }
        } catch (error) {
            console.error('Submission error:', error);
        }
    };


    return (
        <SafeAreaView style={styles.container}>
            <View style={{ flex: 1 }}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                    style={{ flex: 1 }}
                    keyboardVerticalOffset={insets.top + 60}
                >
                    <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
                        <View style={styles.headerRow}>
                            <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 20 }}>
                                <Ionicons name="arrow-back" size={24} color={theme.text} />
                            </TouchableOpacity>
                            <Text style={styles.header}>Edit Statistics</Text>
                        </View>

                        {joinedTeams.map((team, index) => {
                            if (focusedIndex !== null && focusedIndex !== index) return null;

                            const isFocused = focusedIndex === index;
                            const isEmpty = teamInputs[index] === '';

                            return (
                                <View
                                    key={team.id}
                                    style={[
                                        styles.row,
                                        {
                                            backgroundColor:
                                                index === 0 ? '#FBBF24' :
                                                    index === 1 ? '#FACC15' :
                                                        index === 2 ? '#FDE68A' :
                                                            '#FEF3C7'
                                        }
                                    ]}
                                >
                                    <Text style={styles.rankText}>{`${index + 1}${getOrdinal(index + 1)}`}</Text>

                                    <TextInput
                                        ref={(ref) => { inputRefs.current[index] = ref; }}
                                        style={styles.input}
                                        value={teamInputs[index] || ''}
                                        onChangeText={(text) => {
                                            const updated = [...teamInputs];
                                            updated[index] = text;
                                            setTeamInputs(updated);

                                            const filtered = joinedTeams
                                                .filter(t =>
                                                    t.team_name.toLowerCase().includes(text.toLowerCase()) &&
                                                    !teamInputs.includes(t.team_name)
                                                );
                                            setSuggestions(filtered);
                                        }}
                                        onFocus={() => {
                                            setFocusedIndex(index);
                                            const filtered = joinedTeams.filter(t => !teamInputs.includes(t.team_name));
                                            setSuggestions(filtered);
                                        }}
                                        onBlur={() => {
                                            const entered = teamInputs[index]?.trim();
                                            const isValid = joinedTeams.some(t => t.team_name === entered);

                                            if (!isValid) {
                                                const updated = [...teamInputs];
                                                updated[index] = '';
                                                setTeamInputs(updated);
                                            }

                                            setFocusedIndex(null);
                                        }}
                                        placeholder={isFocused ? 'Enter team name' : ''}
                                        placeholderTextColor="#999"
                                    />

                                    {isFocused ? (
                                        <TouchableOpacity
                                            onPress={() => {
                                                inputRefs.current[index]?.blur();
                                            }}
                                            style={{ marginLeft: 10 }}
                                        >
                                            <Ionicons name="send-sharp" size={24} color="#000" />
                                        </TouchableOpacity>
                                    ) : (
                                        <TouchableOpacity
                                            onPress={() => {
                                                if (!isEmpty) {
                                                    const updated = [...teamInputs];
                                                    updated[index] = '';
                                                    setTeamInputs(updated);
                                                } else {
                                                    inputRefs.current[index]?.focus();
                                                    setFocusedIndex(index);
                                                }
                                            }}
                                            style={{ marginLeft: 10 }}
                                        >
                                            <Ionicons
                                                name={isEmpty ? 'add-circle-outline' : 'remove-circle-outline'}
                                                size={24}
                                                color="#000"
                                            />
                                        </TouchableOpacity>
                                    )}

                                    {isFocused && suggestions.length > 0 && (
                                        <View style={styles.suggestionBox}>
                                            {suggestions.map((suggestedTeam) => (
                                                <TouchableOpacity
                                                    key={suggestedTeam.id}
                                                    onPress={() => {
                                                        const updated = [...teamInputs];
                                                        updated[index] = suggestedTeam.team_name;
                                                        setTeamInputs(updated);
                                                        inputRefs.current[index]?.blur();
                                                        setFocusedIndex(null);
                                                    }}
                                                    style={styles.suggestionItem}
                                                >
                                                    <Text style={styles.suggestionText}>{suggestedTeam.team_name}</Text>
                                                </TouchableOpacity>
                                            ))}
                                        </View>
                                    )}
                                </View>
                            );
                        })}
                    </ScrollView>
                </KeyboardAvoidingView>

                <View style={[styles.buttonContainer, { paddingBottom: insets.bottom || 16 }]}>
                    <View style={styles.dropdownWrapper}>
                        <Text style={styles.statusLabel}>Change status</Text>
                        <DropDownPicker
                            open={open}
                            value={status}
                            items={items}
                            setOpen={setOpen}
                            setValue={setStatus}
                            setItems={setItems}
                            placeholder="Select status"
                            containerStyle={{ zIndex: 1000 }}
                            dropDownContainerStyle={{
                                backgroundColor: theme.inputBackground,
                                borderColor: theme.inputBorder,
                            }}
                            placeholderStyle={{
                                color: theme.text,
                            }}
                            style={{ backgroundColor: theme.inputBackground, borderColor: theme.inputBorder }}
                            textStyle={{ color: theme.text, }}
                            ArrowDownIconComponent={() => <Ionicons name="chevron-down" size={20} color={theme.text} />}
                            ArrowUpIconComponent={() => <Ionicons name="chevron-up" size={20} color={theme.text} />}
                            TickIconComponent={() => <Ionicons name="checkmark" size={20} color={theme.text} />}
                        />
                    </View>
                    <StartButton title="SAVE" onPress={handleSubmit} />
                </View>
            </View>
        </SafeAreaView>
    );
}

const getStyles = (theme: ReturnType<typeof useTheme>) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.background
    },
    scrollContainer: {
        paddingHorizontal: 20,
        paddingBottom: 40
    },
    header: {
        fontSize: 20,
        fontWeight: 'bold',
        marginVertical: 20,
        color: theme.text,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        paddingBottom: 12,
        paddingTop: 12,
        borderRadius: 12,
        marginVertical: 6,
    },
    rankText: { fontSize: 18, fontWeight: 'bold' },
    plusIcon: { fontSize: 20, fontWeight: 'bold' },
    dropdownWrapper: {
        marginTop: 30,
        zIndex: 10,
    },
    statusLabel: {
        fontSize: 14,
        color: theme.text,
        marginBottom: 8,
    },
    buttonContainer: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: theme.background,
        paddingHorizontal: 20,
        borderTopWidth: 1,
        borderTopColor: '#ddd',
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 20,
    },
    input: {
        flex: 1,
        marginLeft: 12,
        fontSize: 16,
        backgroundColor: 'transparent',
        padding: 8,
        borderRadius: 8,
    },
    suggestionBox: {
        position: 'absolute',
        top: '100%',
        left: 0,
        right: 0,
        backgroundColor: theme.background,
        borderRadius: 8,
        paddingVertical: 4,
        marginTop: 25,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 4,
        zIndex: 999,
        borderWidth: 0.5,
        borderColor: '#ddd',
    },
    suggestionItem: {
        paddingVertical: 8,
        paddingHorizontal: 12,
    },
    suggestionText: {
        fontSize: 14,
        color: theme.text,
    },
});