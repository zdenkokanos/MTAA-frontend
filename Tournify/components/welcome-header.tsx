import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import Logo from './logo'

const WelcomeHeader = () => {
    return (
        <View style={styles.textContainer}>
            <Logo width={150} height={150} />
            <Text style={styles.text}>Welcome at Turnify!</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    textContainer: {
        position: "absolute", // Ensures it stays in place
        top: 50,
        left: 20,
        alignItems: "flex-start",
        flexDirection: "column",
    },
    text: {
        fontFamily: "Arial",
        fontWeight: "600",
        color: "#363636",
        fontSize: 20,
        marginTop: -40,
    },
});

export default WelcomeHeader