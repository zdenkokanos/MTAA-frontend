import React, { useState } from "react";
import {
    View, Text, TextInput, StyleSheet, TouchableOpacity,
    KeyboardAvoidingView, ScrollView, Platform
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import StartButton from "@/components/startButton";
import API_BASE_URL from "../config/config"; // Adjust path as needed

const SignUpForm = () => {
    const router = useRouter();
    const [first_name, setFirstName] = useState("");
    const [last_name, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

    const handleSignUp = async () => {
        if (password !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/users`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ first_name, last_name, email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                await AsyncStorage.setItem("userId", JSON.stringify(data.id));
                router.push("/(tabs)/home");
            } else {
                alert(data.message || "Sign up failed");
            }
        } catch (error) {
            console.error(error);
            alert("An error occurred, please try again.");
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "position" : undefined}
            keyboardVerticalOffset={Platform.OS === "ios" ? 200 : 0}
        >
            <ScrollView
                contentContainerStyle={styles.scrollContainer}
                keyboardShouldPersistTaps="handled"
            >
                <View style={styles.container}>
                    <Text style={styles.text}>New Account</Text>
                    <View>
                        <View style={styles.inputContainer}>
                            <Ionicons name="person-outline" size={20} color="gray" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="First Name"
                                placeholderTextColor="#888"
                                value={first_name}
                                onChangeText={setFirstName}
                                autoCapitalize="words"
                            />
                        </View>
                        <View style={styles.inputContainer}>
                            <Ionicons name="person-outline" size={20} color="gray" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Last Name"
                                placeholderTextColor="#888"
                                value={last_name}
                                onChangeText={setLastName}
                                autoCapitalize="words"
                            />
                        </View>
                    </View>

                    <View style={styles.inputContainer}>
                        <Ionicons name="mail-outline" size={20} color="gray" style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Email"
                            placeholderTextColor="#888"
                            value={email}
                            onChangeText={setEmail}
                            autoCapitalize="none"
                            keyboardType="email-address"
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

                    <View style={styles.inputContainer}>
                        <Ionicons name="key-outline" size={20} color="gray" style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Confirm Password"
                            placeholderTextColor="#888"
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            secureTextEntry={!confirmPasswordVisible}
                        />
                        <TouchableOpacity onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)}>
                            <Ionicons name={confirmPasswordVisible ? "eye-off-outline" : "eye-outline"} size={20} color="gray" />
                        </TouchableOpacity>
                    </View>

                    <StartButton title="Sign up" onPress={handleSignUp} />

                    <Text style={styles.signUpText}>
                        I have an account, <Text style={styles.signUpLink} onPress={() => alert("/signin")}>sign in.</Text>
                    </Text>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default SignUpForm;

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
        justifyContent: "center",
    },
    container: {
        width: "100%",
        alignItems: "center",
        justifyContent: "flex-start",
        backgroundColor: "#fff",
        height: 630,
        padding: 20,
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
    },
    text: {
        fontFamily: "Inter",
        fontWeight: "700",
        color: "#363636",
        fontSize: 25,
        margin: 50,
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
});