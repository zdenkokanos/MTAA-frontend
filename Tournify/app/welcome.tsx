import React, { useState, useEffect, useRef } from "react";
import { Text, StyleSheet, ImageBackground, View, Animated, PanResponder } from "react-native";
import { router } from "expo-router";
import StartButton from "@/components/startButton";
import WelcomeHeader from "@/components/welcome-header";
import LoginForm from "@/components/loginForm";

export default function WelcomeScreen() {
    const [showLogin, setShowLogin] = useState(false);
    const translateY = useRef(new Animated.Value(500)).current; // Start below the screen
    const pan = useRef(new Animated.ValueXY()).current;

    // Create PanResponder to track the swipe gesture
    // const panResponder = PanResponder.create({
    //     onStartShouldSetPanResponder: () => true,
    //     onPanResponderMove: (e, gestureState) => {
    //         // Only move if the user is swiping down (vertical movement)
    //         if (gestureState.dy > 0) {
    //             pan.setValue({ x: 0, y: gestureState.dy });
    //         }
    //     },
    //     onPanResponderRelease: (e, gestureState) => {
    //         // If the user swipes more than 150 units down, close the form
    //         if (gestureState.dy > 150) {
    //             closeForm();
    //         } else {
    //             // Otherwise, reset the form to its initial position
    //             Animated.spring(pan, {
    //                 toValue: { x: 0, y: 0 },
    //                 useNativeDriver: true,
    //             }).start();
    //         }
    //     },
    // });

    useEffect(() => {
        if (showLogin) {
            Animated.timing(translateY, {
                toValue: 0, // Move up to show the form
                duration: 500,
                useNativeDriver: true,
            }).start();
            // } else {
            //     Animated.timing(translateY, {
            //         toValue: 500, // Slide down to hide the form
            //         duration: 500,
            //         useNativeDriver: true,
            //     }).start();
        }
    }, [showLogin]);

    // const closeForm = () => {
    //     setShowLogin(false);
    //     Animated.timing(translateY, {
    //         toValue: 500, // Slide down to hide the form
    //         duration: 500,
    //         useNativeDriver: true,
    //     }).start();

    //     // Reset pan position as well when closing
    //     Animated.spring(pan, {
    //         toValue: { x: 0, y: 0 },
    //         useNativeDriver: true,
    //     }).start();
    // };

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
                <StartButton title="Sign up" onPress={() => router.push("/(tabs)/home")} />
            </View>

            {showLogin && (
                <Animated.View
                    // {...panResponder.panHandlers}
                    style={[styles.loginFormContainer, {
                        transform: [
                            { translateY }, // Slide the form up or down based on `translateY`
                            ...pan.getTranslateTransform(), // Apply pan gesture movement
                        ],
                    }]}
                >
                    <LoginForm />
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