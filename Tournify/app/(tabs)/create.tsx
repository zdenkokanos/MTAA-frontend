import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, SafeAreaView, TextInput } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

import LevelPicker from '@/components/create/levelPicker';
import CategoryPicker from '@/components/create/categoryPicker';

export default function CreateTournament() {

    const [tournamentName, setTournamentName] = useState('');
    const [level, setLevel] = useState('');
    const [sport, setSport] = useState('');
    
    const levels = [
        { label: 'Beginner', value: 'beginner' },
        { label: 'Intermediate', value: 'intermediate' },
        { label: 'Advanced', value: 'advanced' },
        { label: 'Pro', value: 'pro' },
        { label: 'Open', value: 'open' },
      ];
    

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView style={styles.wrapper} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                <ScrollView contentContainerStyle={styles.container}>
                    
                    <View style={styles.row}>
                        <MaterialIcons style={styles.icon} name="edit" size={24} color="black" />
                        <Text style={styles.title}>Create Tournament</Text>
                    </View>

                    <View>
                        <Text style={styles.label}>Tournament Name</Text>
                        <View style={styles.inputWrapper}>
                            <TextInput
                                placeholder="Enter tournament name"
                                style={styles.input}
                                value={tournamentName}
                                onChangeText={setTournamentName}
                            />
                            <FontAwesome6 name="keyboard" size={20} color="black" style={styles.inputIcon} />
                        </View>
                    </View>

                    <View style={styles.inputRow}>
                        <View style={{ width: Platform.OS === 'ios' ? "60%" : '50%'}}>
                            <CategoryPicker sport={sport} setSport={setSport} />
                        </View>
                        <View style={{ width: Platform.OS === 'ios' ? "40%" : '50%'}}>
                            <LevelPicker level={level} setLevel={setLevel} />
                        </View>
                    </View>




                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}


const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
    },
    wrapper: {
        flex: 1,
        backgroundColor: '#fff',
      },
    container: {
        padding: 24,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 25,
    },
    icon: {
        marginTop: 4,
        marginRight: 10,
    },
    row: {
        flexDirection: 'row',
        textAlignVertical: 'center',
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 5,
        marginTop: 10,
        marginLeft: 15,
        color: '#222',
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#eee',
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 10,
        height: 50,
        color: '#f00',
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#000',
        paddingVertical: 0,
    },
    inputIcon: {
        marginRight: 7,
    },
    pickerWrapper: {
        marginVertical: 10,
    },
    pickerContainer: {
        backgroundColor: '#f2f2f2',
        borderRadius: 10,
        paddingHorizontal: 10,
    },
    inputRow: {
        flexDirection: 'row',
        justifyContent: 'space-between', 
        alignItems: 'baseline',
    }
});