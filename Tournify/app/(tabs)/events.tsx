import OfflineBanner from "@/components/offline/offlineBanner";
import { Text, View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function WelcomeScreen() {
    return (
        <SafeAreaView style={styles.container}>
            <OfflineBanner />
            <View style={styles.container}>
                <Text style={styles.text}>Events Screen</Text>
            </View>
        </SafeAreaView>
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
