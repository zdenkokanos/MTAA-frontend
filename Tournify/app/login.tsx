import { Text, View, StyleSheet, TextInput } from "react-native";
import { Link } from "expo-router";

export default function Index() {

    return (
        <View style={styles.container}>
            <Text>Welcome back</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter text"
            />
            <TextInput
                style={styles.input}
                placeholder="Enter text"
            />
            <Link href="/(tabs)/home" style={styles.button}> Sign in </Link>
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
    input: {
        height: 40,
        borderColor: '#000',
        borderWidth: 1,
        padding: 10,
        marginBottom: 20,
        width: '80%',
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
