import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import StartButton from '../components/startButton';
import API_BASE_URL from "../config/config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GOOGLE_MAPS_API_KEY } from '@env';
import 'react-native-get-random-values';


// Zustand
import { useSignUpStore } from "@/stores/signUpStore";

export default function CityPreferencesScreen() {

    const router = useRouter();
    const [error, setError] = useState('');

    const { // Zustand store
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
    } = useSignUpStore();

    const { reset } = useSignUpStore();

    useEffect(() => {
        setField("preferredLongitude", -122.4194);
        setField("preferredLatitude", 37.7749);
    }, []); // empty dependency array ensures this only runs once on mount


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
                    // Don't set Content-Type! Let fetch set the boundary.
                    Authorization: `Bearer ${await AsyncStorage.getItem("token")}`, // Optional, if needed
                },
                body: formData,
            });

            const data = await response.json();

            if (response.ok) {
                await AsyncStorage.setItem("userId", JSON.stringify(data.user.id));
                await AsyncStorage.setItem("token", data.token);
                reset(); // Reset the store after successful sign up
                router.replace("/(tabs)/home");
            } else {
                alert(data.message || "Sign up failed");
            }
        } catch (error) {
            console.error("Sign up error:", error);
            alert("An error occurred. Please try again.");
        }
    };

    console.log(GOOGLE_MAPS_API_KEY);

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
                                value={preferredLocation}
                                onChangeText={(text) => setField('preferredLocation', text)}
                                placeholderTextColor="#999"
                            />
                            <Ionicons name="location-outline" size={20} color="#222" style={styles.icon} />
                        </View>
                        <GooglePlacesAutocomplete
                            placeholder="Enter your city"
                            onPress={(data, details) => {
                                if (!details) return;

                                const cityName = data.description;
                                const { lat, lng } = details.geometry.location;

                                setField("preferredLocation", cityName);
                                setField("preferredLatitude", lat);
                                setField("preferredLongitude", lng);
                            }}

                            fetchDetails={true}
                            query={{
                                key: GOOGLE_MAPS_API_KEY,
                                language: 'en',
                                types: '(cities)',
                            }}
                            styles={{
                                textInput: {
                                    backgroundColor: '#f2f2f2',
                                    borderRadius: 12,
                                    paddingHorizontal: 16,
                                    height: 48,
                                },
                                container: { flex: 0 },
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