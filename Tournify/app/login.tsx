import { Text, View, StyleSheet, TextInput, ImageBackground, Button, TouchableOpacity, TouchableWithoutFeedback, KeyboardAvoidingView, Platform, Keyboard, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import StartButton from "@/components/startButton";
import { Ionicons } from '@expo/vector-icons';

export default function LoginScreen() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordVisible, setPasswordVisible] = useState(false);

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
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
                        <StartButton title="Sign in" onPress={() => router.push("/(tabs)/home")} />
                        <Text style={styles.signUpText}>
                            Don't have an account? <Text style={styles.signUpLink} onPress={() => router.push("/register")}>Sign up.</Text>
                        </Text>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    text: {
        fontFamily: "Inter",
        fontWeight: "bold",
        fontSize: 25,
        margin: 20,
        marginTop: 50,
        marginBottom: 40,
    },
    container: {
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
        backgroundColor: "#fff",
    },
    input: {
        flex: 1,
        height: 40,
        paddingHorizontal: 10,
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

