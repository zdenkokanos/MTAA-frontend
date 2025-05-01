import { Text, View, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Keyboard, Image, TouchableWithoutFeedback } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import StartButton from "@/components/startButton";
import API_BASE_URL from "../config/config";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SignUpScreen() {
    const router = useRouter();

    const [first_name, setFirstName] = useState("");
    const [last_name, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const preferredLocation = "summertime";
    const preferredLongitude = -122.4194;
    const preferredLatitude = 37.7749;
    const selectedPreferences = [1, 2, 3];

    const pickImage = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permissionResult.granted) {
            alert("Permission to access media library is required!");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.5,
        });

        if (!result.canceled) {
            setProfileImage(result.assets[0].uri);
        }
    };

    const handleSignUp = async () => {
        if (password !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        try {
            const formData = new FormData();

            formData.append("first_name", first_name);
            formData.append("last_name", last_name);
            formData.append("email", email);
            formData.append("password", password);
            formData.append("preferred_location", preferredLocation);
            formData.append("preferred_longitude", preferredLongitude.toString());
            formData.append("preferred_latitude", preferredLatitude.toString());
            formData.append("preferences", JSON.stringify(selectedPreferences)); // if needed by backend

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
                router.push("/(tabs)/home");
            } else {
                alert(data.message || "Sign up failed");
            }
        } catch (error) {
            console.error("Sign up error:", error);
            alert("An error occurred. Please try again.");
        }
    };


    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
                    <KeyboardAwareScrollView
                        contentContainerStyle={{ flexGrow: 1 }}
                        keyboardShouldPersistTaps="handled"
                        enableOnAndroid
                    >
                        <View style={styles.container}>
                            <TouchableOpacity onPress={pickImage} style={styles.profileImageContainer}>
                                {profileImage ? (
                                    <Image source={{ uri: profileImage }} style={styles.profileImage} />
                                ) : (
                                    <View style={styles.profilePlaceholder}>
                                        <Ionicons name="camera-outline" size={30} color="#888" />
                                    </View>
                                )}
                            </TouchableOpacity>

                            <Text style={styles.text}>Create New Account</Text>

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
                                    textContentType="emailAddress"
                                    autoComplete="email"
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
                                    textContentType="newPassword"
                                    autoComplete="password"
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
                                    textContentType="newPassword"
                                    autoComplete="password"
                                />
                                <TouchableOpacity onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)}>
                                    <Ionicons name={confirmPasswordVisible ? "eye-off-outline" : "eye-outline"} size={20} color="gray" />
                                </TouchableOpacity>
                            </View>

                            <StartButton title="Sign up" onPress={handleSignUp} />

                            <Text style={styles.signUpText}>
                                I have an account, <Text style={styles.signUpLink} onPress={() => router.push("/login")}>sign in.</Text>
                            </Text>
                        </View>
                    </KeyboardAwareScrollView>
                </SafeAreaView>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
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
        backgroundColor: "#fff",
        paddingBottom: 60,
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
    profileImageContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 2,
        borderColor: "#ccc",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 30,
        marginBottom: 20,
        overflow: "hidden",
    },
    profilePlaceholder: {
        width: "100%",
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f0f0f0",
    },
    profileImage: {
        width: "100%",
        height: "100%",
        resizeMode: "cover",
    },
});
