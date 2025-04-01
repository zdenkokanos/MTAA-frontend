import { Text, StyleSheet, ImageBackground, View, Image } from "react-native";
import { router } from "expo-router";
import StartButton from "@/components/startButton";
import WelcomeHeader from "@/components/welcome-header";

export default function WelcomeScreen() {
    return (
        <ImageBackground
            source={require("../images/baseball-md.jpg")}
            style={styles.container}
        >
            <WelcomeHeader />
            <StartButton title="Sign in" onPress={() => router.push("/login")} />
            <StartButton title="Sign up" onPress={() => router.push("/(tabs)/home")} />
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
});