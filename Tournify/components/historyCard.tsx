import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface HistoryCardProps {
    title: string;
    date: string;
    position: string;
    imageUrl: any;
    onInfoPress: () => void;
}

const HistoryCard = ({ title, date, position, imageUrl, onInfoPress }: HistoryCardProps) => {
    return (
        <View style={styles.card}>
            <Image source={imageUrl} style={styles.image} />
            <View style={styles.content}>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.date}>{date}</Text>
                <View style={styles.badge}>
                    <Text style={styles.badgeText}>{position}</Text>
                </View>
            </View>
            <TouchableOpacity style={styles.infoButton} onPress={onInfoPress}>
                <Ionicons name="information-circle-outline" size={30} color="#000" />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        padding: 12,
        borderRadius: 12,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
        marginVertical: 8,
        marginHorizontal: 16,
    },
    image: {
        width: 80,
        height: 80,
        borderRadius: 12,
        marginRight: 12,
    },
    content: {
        flex: 1,
    },
    title: {
        fontSize: 16,
        fontWeight: "bold",
    },
    date: {
        color: "#999",
        marginTop: 2,
    },
    badge: {
        marginTop: 8,
        backgroundColor: "#F5C344",
        paddingVertical: 4,
        paddingHorizontal: 12,
        borderRadius: 8,
        alignSelf: "flex-start",
    },
    badgeText: {
        fontSize: 13,
        fontWeight: "600",
        color: "#000",
    },
    infoButton: {
        marginLeft: 12,
    },
});


export default HistoryCard;
