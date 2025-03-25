import { Text, View, StyleSheet } from "react-native";

export default function WelcomeScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Create Screen</Text>
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
