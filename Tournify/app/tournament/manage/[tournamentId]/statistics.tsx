import React, { useRef, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, KeyboardAvoidingView, Platform, TextInput } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import DropDownPicker from 'react-native-dropdown-picker';
import StartButton from '@/components/startButton';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

const joinedTeams = [
    { id: 1, name: 'Team Alpha' },
    { id: 2, name: 'Team Beta' },
    { id: 3, name: 'Team Gamma' },
    { id: 4, name: 'Team Delta' },
    { id: 5, name: 'Team Delta' },
    { id: 6, name: 'Team Delta' },
];

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
        { label: 'Completed', value: 'Completed' },
        { label: 'Scheduled', value: 'Scheduled' },
    ]);
    const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
    const [teamInputs, setTeamInputs] = useState(Array(joinedTeams.length).fill(''));
    const inputRefs = useRef<(TextInput | null)[]>([]);

    return (
        <SafeAreaView style={styles.container}>
            <View style={{ flex: 1 }}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                    style={{ flex: 1 }}
                    keyboardVerticalOffset={insets.top + 60}
                >
                    <ScrollView contentContainerStyle={styles.scrollContainer}>
                        <View style={styles.headerRow}>
                            <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 20 }}>
                                <Ionicons name="arrow-back" size={24} color="#000" />
                            </TouchableOpacity>
                            <Text style={styles.header}>Edit Statistics</Text>
                        </View>

                        {teamInputs.map((name, index) => {
                            if (focusedIndex !== null && focusedIndex !== index) return null;

                            return (
                                <View
                                    key={index}
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
                                        value={teamInputs[index]}
                                        onChangeText={(text) => {
                                            const updated = [...teamInputs];
                                            updated[index] = text;
                                            setTeamInputs(updated);
                                        }}
                                        onFocus={() => setFocusedIndex(index)}
                                        onBlur={() => setFocusedIndex(null)}

                                    />

                                    {focusedIndex === index && (
                                        <TouchableOpacity
                                            onPress={() => {
                                                inputRefs.current[index]?.blur();
                                            }}
                                            style={{ marginLeft: 10 }}
                                        >
                                            <Ionicons name="send-sharp" size={24} color="#000000" />
                                        </TouchableOpacity>
                                    )}
                                </View>
                            );
                        })}



                    </ScrollView>
                </KeyboardAvoidingView>

                {/* Fixed Bottom Save Button */}
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
                        />
                    </View>
                    <StartButton title="SAVE" onPress={() => console.log("pushed")} />
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: 'white' },
    scrollContainer: { paddingHorizontal: 20, paddingBottom: 40 },
    header: { fontSize: 20, fontWeight: 'bold', marginVertical: 20 },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderRadius: 12,
        marginVertical: 6,
    },
    rankText: { fontSize: 18, fontWeight: 'bold' },
    plusIcon: { fontSize: 20, fontWeight: 'bold' },
    dropdownWrapper: {
        marginTop: 30,
        zIndex: 10, // important for dropdown visibility
    },
    statusLabel: {
        fontSize: 14,
        color: '#555',
        marginBottom: 8,
    },
    buttonContainer: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'white',
        paddingHorizontal: 20,
        borderTopWidth: 1,
        borderTopColor: '#ddd',
    },
    saveText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 16,
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
});
