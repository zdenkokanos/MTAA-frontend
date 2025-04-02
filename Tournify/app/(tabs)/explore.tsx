import { Text, View, StyleSheet, KeyboardAvoidingView } from "react-native";
import LoginForm from "@/components/loginForm";

export default function WelcomeScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Explore Screen</Text>
            <View style={{ position: "absolute", bottom: 0, width: "100%" }}>
                <KeyboardAvoidingView
                    behavior="position">
                    <LoginForm />
                </KeyboardAvoidingView>
            </View>
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#4FC1FF",
        alignItems: "center",
        justifyContent: "center",
    },
    text: {
        color: "#fff",
        fontSize: 50,
    },
});
