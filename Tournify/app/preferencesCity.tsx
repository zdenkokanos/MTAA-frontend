import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import StartButton from '../components/startButton';



export default function CityPreferencesScreen () {

    const router = useRouter();
    const [city, setCity] = useState('');
    const [error, setError] = useState('');



    const handleContinue = () => {
        if (!city.trim()) {
            setError('Please enter your city.');
        } else {
            setError('');
            router.push('/(tabs)/home');
        }
    };


    return (
        <SafeAreaView style={styles.safeArea}>
            <Text style={styles.heading}>
                Choose your,{'\n'}
                <Text style={styles.bold}>City</Text>
            </Text>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.flex}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.container}>
                    

                    <Text style={styles.label}>Your City</Text>
                    <View style={styles.inputWrapper}>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter your city"
                        value={city}
                        onChangeText={setCity}
                        placeholderTextColor="#999"
                    />
                    <Ionicons name="location-outline" size={20} color="#222" style={styles.icon} />
                    </View>

                    {error ? <Text style={styles.error}>{error}</Text> : null}

                    <View style={styles.buttonWrapper}>
                    <StartButton title="Continue" onPress={handleContinue} />
                    </View>
                </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: '#fff',
    },
    flex: {
      flex: 1,
    },
    heading: {
        fontSize: 24,
        marginLeft: 20,
        marginTop: 20,
    },
    container: {
      flex: 1,
      padding: 24,
      justifyContent: 'center',
    },
    bold: {
        fontSize: 32,
        fontWeight: 'bold',
    },
    label: {
        marginBottom: 6,
        color: '#333',
        fontSize: 14,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f2f2f2',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        marginBottom: 15,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#000',
    },
    icon: {
        marginLeft: 8,
    },
    buttonWrapper: {
        alignItems: 'center',
    },
    error: {
        color: '#d9534f',
        fontSize: 14,
        marginBottom: 10,
        textAlign: 'center',
    },
    
    
});