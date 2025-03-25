import { Text, View, StyleSheet } from "react-native";
import { Link } from "expo-router";

export default function Index() {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Welcome back!</Text>
            <Link href="/login" style={styles.button}>
                Sign In
            </Link>
            <Link href="/register" style={styles.button}>
                Sign Up
            </Link>
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
    button: {
        color: "#000",
        fontSize: 20,
        backgroundColor: "#fff",
        padding: 10,
        borderRadius: 5,
        marginTop: 20,
    },
});
