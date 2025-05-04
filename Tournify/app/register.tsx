import { Text, View, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Keyboard, Image, TouchableWithoutFeedback } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import StartButton from "@/components/startButton";
import * as ImagePicker from "expo-image-picker";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SafeAreaView } from "react-native-safe-area-context";

// Zustand
import { useSignUpStore } from "@/stores/signUpStore";
import { useTheme } from "@/themes/theme";
import SafeOfflineBanner, { OfflineBanner } from "@/components/safeOfflineBanner";

export default function SignUpScreen() {
    const router = useRouter();

    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false)

    const { // Zustand store
        firstName,
        lastName,
        email,
        password,
        profileImage,
        setField,
    } = useSignUpStore();

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
            setField("profileImage", result.assets[0].uri);
        }
    };

    const handleContinue = () => {
        if (!firstName.trim() || !lastName.trim() || !email.trim() || !password.trim()) {
            alert("Please fill in all required fields.");
            return;
        }

        if (password !== confirmPassword) {
            alert("Passwords do not match.");
            return;
        }

        router.replace("/preferencesSport"); // go to next screen
    };

    const theme = useTheme();
    const styles = useMemo(() => getStyles(theme), [theme]);

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <SafeOfflineBanner />
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <SafeAreaView style={styles.safeArea}>
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
                                    value={firstName}
                                    onChangeText={(text) => setField('firstName', text)}
                                    autoCapitalize="words"
                                />
                            </View>

                            <View style={styles.inputContainer}>
                                <Ionicons name="person-outline" size={20} color="gray" style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Last Name"
                                    placeholderTextColor="#888"
                                    value={lastName}
                                    onChangeText={(text) => setField('lastName', text)}
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
                                    onChangeText={(text) => setField('email', text)}
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
                                    onChangeText={(text) => setField('password', text)}
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

                            <StartButton title="Sign up" onPress={handleContinue} />

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

const getStyles = (theme: ReturnType<typeof useTheme>) => StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: theme.background,
    },
    text: {
        fontFamily: "Inter",
        fontWeight: "bold",
        fontSize: 25,
        margin: 20,
        marginTop: 50,
        marginBottom: 40,
        color: theme.text,
    },
    container: {
        alignItems: "center",
        backgroundColor: theme.background,
        paddingBottom: 60,
    },
    input: {
        flex: 1,
        height: 40,
        paddingHorizontal: 10,
        color: theme.text,
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: theme.inputBorder,
        borderRadius: 8,
        paddingHorizontal: 10,
        marginBottom: 20,
        width: "80%",
        backgroundColor: theme.inputBackground,
    },
    inputIcon: {
        marginRight: 10,
    },
    signUpText: {
        marginTop: 20,
        fontSize: 14,
        color: theme.text,
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
        borderColor: theme.inputBorder,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 30,
        marginBottom: 20,
        overflow: "hidden",
        backgroundColor: theme.inputBackground,
    },
    profilePlaceholder: {
        width: "100%",
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: theme.inputBackground,
    },
    profileImage: {
        width: "100%",
        height: "100%",
        resizeMode: "cover",
    },
});
