import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import StartButton from '../components/startButton';
import API_BASE_URL from "../config/config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import 'react-native-get-random-values';

// API Key
import Constants from 'expo-constants';
const apiKey = Constants?.expoConfig?.extra?.GOOGLE_MAPS_API_KEY ?? 'DEFAULT_FALLBACK_KEY';


// Zustand
import { useSignUpStore } from "@/stores/signUpStore";

export default function CityPreferencesScreen() {
    const router = useRouter();
    const [error, setError] = useState('');
    

    const {
        firstName,
        lastName,
        email,
        password,
        profileImage,
        preferredLocation,
        preferredLongitude,
        preferredLatitude,
        preferences,
        setField,
        reset
    } = useSignUpStore();

    useEffect(() => {
        setField("preferredLongitude", -122.4194);
        setField("preferredLatitude", 37.7749);
    }, []);

    const handleSignUp = async () => {
        try {
            const formData = new FormData();

            formData.append("first_name", firstName);
            formData.append("last_name", lastName);
            formData.append("email", email);
            formData.append("password", password);
            formData.append("preferred_location", preferredLocation);
            formData.append("preferred_longitude", preferredLongitude.toString());
            formData.append("preferred_latitude", preferredLatitude.toString());
            preferences.forEach(pref =>
                formData.append("preferences[]", pref.toString())
            );

            if (profileImage) {
                const fileName = profileImage.split("/").pop() || "profile.jpg";
                const fileType = fileName.split(".").pop();
                formData.append("image", {
                    uri: profileImage,
                    type: `image/${fileType}`,
                    name: fileName,
                } as any);
            }

            const response = await fetch(`${API_BASE_URL}/auth/register`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${await AsyncStorage.getItem("token")}`,
                },
                body: formData,
            });

            const data = await response.json();

            if (response.ok) {
                await AsyncStorage.setItem("userId", JSON.stringify(data.user.id));
                await AsyncStorage.setItem("token", data.token);
                reset();
                router.replace("/(tabs)/home");
            } else {
                alert(data.message || "Sign up failed");
            }
        } catch (error) {
            console.error("Sign up error:", error);
            alert("An error occurred. Please try again.");
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

                        <GooglePlacesAutocomplete
                            placeholder="Enter your city"
                            onPress={(data, details) => {
                                if (!details) return;
                                const cityName = data.description;
                                const { lat, lng } = details.geometry.location;
                                setField("preferredLocation", cityName);
                                setField("preferredLatitude", lat);
                                setField("preferredLongitude", lng);
                                setError("");
                            }}
                            fetchDetails={true}
                            query={{
                                key: apiKey,
                                language: 'en',
                                types: '(cities)',
                            }}
                            styles={{
                                textInput: {
                                    backgroundColor: '#f2f2f2',
                                    borderRadius: 12,
                                    paddingHorizontal: 16,
                                    height: 48,
                                    fontSize: 16,
                                },
                                container: { marginBottom: 16 },
                            }}
                        />

                        {error ? <Text style={styles.error}>{error}</Text> : null}

                        <View style={styles.buttonWrapper}>
                            <StartButton title="Continue" onPress={handleSignUp} />
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
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
    bold: {
        fontSize: 32,
        fontWeight: 'bold',
    },
    container: {
        flex: 1,
        padding: 24,
        justifyContent: 'center',
    },
    label: {
        marginBottom: 6,
        color: '#333',
        fontSize: 14,
    },
    buttonWrapper: {
        alignItems: 'center',
        marginTop: 10,
    },
    error: {
        color: '#d9534f',
        fontSize: 14,
        marginBottom: 10,
        textAlign: 'center',
    },
});
