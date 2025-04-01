import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import StartButton from "@/components/startButton";
import API_BASE_URL from "../config/config"; // Adjust path as needed

const LoginForm = () => {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordVisible, setPasswordVisible] = useState(false);

    const handleSignIn = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/users/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                await AsyncStorage.setItem("userId", JSON.stringify(data.id));
                router.push("/(tabs)/home");
            } else {
                alert(data.message || "Login failed");
            }
        } catch (error) {
            console.error(error);
            alert("An error occurred, please try again.");
        }
    };

    return (
        <View style={styles.container}>
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
    );
};

export default LoginForm;

const styles = StyleSheet.create({
    container: {
        width: "100%",
        alignItems: "center",
        justifyContent: "flex-start",
        backgroundColor: "#fff",
        height: 550,
        padding: 20,
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
    },
    text: {
        fontFamily: "Inter",
        fontWeight: "700",
        color: "#363636",
        fontSize: 25,
        margin: 60,
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
    input: {
        flex: 1,
        height: 40,
        paddingHorizontal: 10,
    },
    inputIcon: {
        marginRight: 10,
    },
    signUpText: {
        marginTop: 20,
        fontSize: 14,
        position: "absolute",
        bottom: 40,
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