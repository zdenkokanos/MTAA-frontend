
import React, { useState, useEffect, useRef } from "react";
import { Text, StyleSheet, ImageBackground, View, Animated, PanResponder, KeyboardAvoidingView, Platform } from "react-native";
import { router } from "expo-router";
import StartButton from "@/components/startButton";
import WelcomeHeader from "@/components/welcome-header";
import LoginForm from "@/components/loginForm";
import SignUpForm from "@/components/signupForm";

export default function WelcomeScreen() {
    const [showLogin, setShowLogin] = useState(false);
    const [showSignUp, setShowSignUp] = useState(false);
    const translateY = useRef(new Animated.Value(800)).current; // Start below the screen
    //Chat GPT code used for animation
    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderMove: Animated.event(
                [null, { dy: translateY }],
                { useNativeDriver: false }  // Keep it false for JS control
            ),
            onPanResponderRelease: (e, gestureState) => {
                if (gestureState.dy > 100) {
                    // Swipe down enough to close
                    Animated.timing(translateY, {
                        toValue: 800, // Move it back down
                        duration: 500,
                        useNativeDriver: false, // Ensure useNativeDriver is false here as well
                    }).start(() => {
                        setShowLogin(false); // Close after the animation finishes
                        setShowSignUp(false); // Close after the animation finishes
                    });
                } else {
                    // If not swiped enough, return to original position
                    Animated.timing(translateY, {
                        toValue: 0, // Move up to show the form
                        duration: 500,
                        useNativeDriver: false, // Keep it false to handle animation with JS
                    }).start();
                }
            },
        })
    ).current;
    //End of Chat GPT code

    useEffect(() => {
        if (showLogin) {
            Animated.timing(translateY, {
                toValue: 0, // Move up to show the form
                duration: 500,
                useNativeDriver: false, // Keep this consistent with JS-based animation
            }).start();
        } else if (showSignUp) {
            Animated.timing(translateY, {
                toValue: 0, // Move up to show the form
                duration: 500,
                useNativeDriver: false, // Keep this consistent with JS-based animation
            }).start();
        }
    }, [showLogin, showSignUp]);
    return (
        <ImageBackground
            source={require("../images/baseball-md.jpg")}
            style={styles.container}
        >
            <View style={styles.headerContainer}>
                <WelcomeHeader />
            </View>
            <View style={styles.buttonContainer}>
                <StartButton title="Sign in" onPress={() => setShowLogin(true)} />
                <StartButton title="Sign up" onPress={() => setShowSignUp(true)} />
            </View>

            {showLogin && (
                <Animated.View
                    {...panResponder.panHandlers} // Attach pan responder
                    style={[styles.loginFormContainer, {
                        transform: [
                            { translateY }, // Slide the form up or down based on `translateY`
                        ],
                    }]}
                >
                    <LoginForm />
                </Animated.View>
            )}
            {showSignUp && (
                <Animated.View
                    {...panResponder.panHandlers} // Attach pan responder
                    style={[styles.loginFormContainer, {
                        transform: [
                            { translateY }, // Slide the form up or down based on `translateY`
                        ],
                    }]}
                >
                    <SignUpForm />
                </Animated.View>
            )}
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