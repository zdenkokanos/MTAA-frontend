import { Text, View, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, TouchableWithoutFeedback, Platform, ScrollView, Keyboard } from "react-native";
import { Link, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import StartButton from "@/components/startButton";

export default function SignUpScreen() {
    const router = useRouter();

    const [first_name, setFirstName] = useState("");
    const [last_name, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
                    <View style={styles.container}>
                        <Text style={styles.text}>Create New Account</Text>
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

                        <StartButton title="Sign up" onPress={() => router.push("/sport_preferences")} />

                        <Text style={styles.signUpText}>
                            I have an account, <Text style={styles.signUpLink} onPress={() => router.push("/login")}>sign in.</Text>
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
        paddingBottom: 20,
    },
    forgotPassword: {
        color: "#2F80ED",
        textDecorationLine: "underline",
        marginBottom: 20,
    },
});
