import { View, Text, StyleSheet, Image, TouchableOpacity, ImageBackground } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface TournamentCardProps {
    title: string;
    dateText: string;         // e.g., "in 10 days"
    distanceText: string;     // e.g., "20 km from you"
    imageUrl: any;         // e.g., image URL or require('...') local path
    onInfoPress: () => void;
}

const TournamentCard = ({ title, dateText, distanceText, imageUrl, onInfoPress }: TournamentCardProps) => {
    return (
        <View style={styles.card}>
            <ImageBackground source={imageUrl} style={styles.image} imageStyle={{ borderRadius: 12 }}
                onError={(error) => {
                    console.log("Image failed to load:", error.nativeEvent.error);
                }}>
                <View style={styles.overlay}>
                    <View style={styles.rowContainer}>
                        <View>
                            <Text style={styles.title}>{title}</Text>

                            <View style={styles.detailsRow}>
                                <Ionicons name="calendar-outline" size={16} color="#000" />
                                <Text style={styles.detailText}>{dateText}</Text>

                                <Ionicons name="location-outline" size={16} color="#000" style={{ marginLeft: 12 }} />
                                <Text style={styles.detailText}>{distanceText}</Text>
                            </View>
                        </View>

                        <View style={{ flex: 1 }} />

                        <TouchableOpacity style={styles.infoButton} onPress={onInfoPress}>
                            <Text style={styles.infoText}>Info</Text>
                        </TouchableOpacity>
                    </View>
                </View>

            </ImageBackground>
        </View>
    );
};


export default TournamentCard;

const styles = StyleSheet.create({
    rowContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    card: {
        borderRadius: 20,
        overflow: "hidden",
        elevation: 3,
    },
    image: {
        width: "100%",
        height: 194,
        justifyContent: "flex-end",
    },
    overlay: {
        backgroundColor: "rgba(205, 205, 205, 0.75)",
        padding: 18,
    },
    title: {
        color: "#000",
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 8,
    },
    detailsRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    infoGroup: {
        flexDirection: "row",
    },
    detailText: {
        color: "#000",
        marginLeft: 4,
        fontSize: 12,
    },
    infoButton: {
        backgroundColor: "#3f7368",
        paddingHorizontal: 30,
        paddingVertical: 10,
        borderRadius: 10,
        marginLeft: 20,
    },
    infoText: {
        color: "#fff",
        fontWeight: "600",
        fontSize: 15,
    },
});

