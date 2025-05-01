import { View, Text, StyleSheet, ImageBackground, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons"; // For icon placeholder, or use a custom QR icon
import { useRouter } from "expo-router";

interface TicketCardProps {
    ticketId: string;      // Unique ticket ID
    dateText: string;       // e.g., "in 10 days"
    imageUrl: any;          // require(...) or { uri: ... }
}

const TicketCard = ({ ticketId, dateText, imageUrl }: TicketCardProps) => {
    const router = useRouter();

    const handlePress = () => {
        router.push({
            pathname: "/ticket/[ticketId]",
            params: { ticketId },
        });
    };

    return (
        <TouchableOpacity onPress={handlePress} activeOpacity={0.85}>
            <ImageBackground
                source={imageUrl}
                style={styles.card}
                imageStyle={styles.image}
            >
                <View style={styles.darkOverlay} />
                <View style={styles.overlay}>
                    <Ionicons name="qr-code-outline" size={50} color="#fff" />
                    <Text style={styles.text}>{dateText}</Text>
                </View>
            </ImageBackground>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        width: 146,
        height: 88,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 20,
        overflow: "hidden",
    },
    image: {
        borderRadius: 20,
    },
    overlay: {
        alignItems: "center",
        justifyContent: "center",
    },
    text: {
        color: "#fff",
        marginTop: 6,
        fontSize: 14,
        fontWeight: "500",
    },
    darkOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0, 0, 0, 0.35)", // adjust opacity as needed
        borderRadius: 20,
    },
});


export default TicketCard;
