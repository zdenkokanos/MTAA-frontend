
import React, { useState, useEffect, useRef } from "react";
import { Text, StyleSheet, ImageBackground, View, Animated, PanResponder, KeyboardAvoidingView, Platform } from "react-native";
import { router } from "expo-router";
import StartButton from "@/components/startButton";
import WelcomeHeader from "@/components/welcome-header";

export default function WelcomeScreen() {

    return (
        <ImageBackground
            source={require("../images/baseball-md.jpg")}
            style={styles.container}
        >
            <View style={styles.headerContainer}>
                <WelcomeHeader />
            </View>
            <View style={styles.buttonContainer}>
                <StartButton title="Sign in" onPress={() => router.push("/login")} />
                <StartButton title="Sign up" onPress={() => router.push("/register")} />
            </View>

        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    loginFormContainer: {
        width: "100%",
        position: "absolute",
        bottom: 0,
    },
    buttonContainer: {
        marginTop: 100,
    },
    headerContainer: {
        position: "absolute",
        top: 80,
        left: 40,
    },
});