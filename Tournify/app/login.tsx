import { Text, View, StyleSheet, TextInput, ImageBackground, Button, TouchableOpacity, TouchableWithoutFeedback, KeyboardAvoidingView, Platform, Keyboard } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import WelcomeHeader from "@/components/welcome-header";
import StartButton from "@/components/startButton";
import { Ionicons } from '@expo/vector-icons';
import API_BASE_URL from "../config/config"; // If placed in "config/"

export default function LoginScreen() {
    const router = useRouter(); // Get the router instance

    const [email, setEmail] = useState(""); // Store email input
    const [password, setPassword] = useState(""); // Store password input
    const [passwordVisible, setPasswordVisible] = useState(false);

    const handleSignIn = async () => {
        // Backend URL
        const backendUrl = `${API_BASE_URL}/users/login`;

        try {
            const response = await fetch(backendUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                // Handle successful login, navigate to the home page
                await AsyncStorage.setItem('userId', JSON.stringify(data.id));
                router.push("/(tabs)/home");
            } else {
                // Handle errors, e.g., invalid credentials
                alert(data.message || "Login failed");
            }
        } catch (error) {
            console.error(error);
            alert("An error occurred, please try again.");
        }
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
            >
                <ImageBackground
                    source={require('../images/baseball-md.jpg')}
                    style={styles.container}
                >
                    <WelcomeHeader />
                    <View style={styles.loginContainer}>
                        <Text style={styles.text}>Welcome back!</Text>
                        <View style={styles.inputContainer}>
                            <Ionicons name="mail-outline" size={20} color="gray" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Email"
                                placeholderTextColor="#888"
                                value={email}
                                onChangeText={setEmail}
                                autoCapitalize="none"
                            />
                        </View>
                        <View style={styles.inputContainer}>
                            <Ionicons name="key-outline" size={20} color="gray" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Password"
                                placeholderTextColor="#888"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry={!passwordVisible}
                            />
                            <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
                                <Ionicons name={passwordVisible ? "eye-off-outline" : "eye-outline"} size={20} color="gray" />
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity onPress={() => alert("Forgot Password?")}>
                            <Text style={styles.forgotPassword}>Forgot Password?</Text>
                        </TouchableOpacity>
                        <StartButton title="Sign in" onPress={handleSignIn} />
                        <Text style={styles.signUpText}>
                            Don't have an account? <Text style={styles.signUpLink} onPress={() => alert("Sign up!")}>Sign up.</Text>
                        </Text>
                    </View>
                </ImageBackground>
            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    text: {
        fontFamily: "Inter",
        fontWeight: "700",
        color: "#363636",
        fontSize: 25,
        // alignSelf: "flex-start",
        margin: 20,
        marginTop: 50,
        marginBottom: 40,
    },
    container: {
        alignItems: "center",
        justifyContent: "flex-end",
        flex: 1,
    },
    input: {
        flex: 1,
        height: 40,
        paddingHorizontal: 10,
    },
    loginContainer: {
        width: '100%',
        height: '70%',  // This ensures the container takes up 75% of the screen height
        alignItems: "center",  // Center content horizontally
        justifyContent: "flex-start",  // Center content vertically within the container
        backgroundColor: "#fff",
        padding: 20,
        borderTopLeftRadius: 40,  // Rounded top-left corner
        borderTopRightRadius: 40,  // Rounded top-right corner
        marginBottom: 0,  // Remove marginTop and use height to control position
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        paddingHorizontal: 10,
        marginBottom: 20,
        width: "80%",
        backgroundColor: "#fff",
    },
    inputIcon: {
        marginRight: 10,
    },
    signUpText: {
        marginTop: 20,
        fontSize: 14,
    },
    signUpLink: {
        color: "#2F80ED",
        textDecorationLine: "underline",
    },
    forgotPassword: {
        color: "#2F80ED",
        textDecorationLine: "underline",
        marginBottom: 20,
    },
});

