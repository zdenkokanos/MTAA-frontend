import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from 'expo-router';
import { useTheme } from "@/themes/theme";
import { useMemo } from "react";
import useRelativeDate from "@/hooks/useRelativeDate";

interface TournamentCardProps {
    title: string;
    date: string;
    distanceText: string;
    imageUrl: any;
    tournamentId: string;
}

const TournamentView = ({ title, date, distanceText, imageUrl, tournamentId }: TournamentCardProps) => {
    const theme = useTheme();
    const styles = useMemo(() => getStyles(theme), [theme]);
    const router = useRouter();
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
                                <Text style={styles.detailText}>{useRelativeDate(date)}</Text>

                                <Ionicons name="location-outline" size={16} color="#000" style={{ marginLeft: 12 }} />
                                <Text style={styles.detailText}>{distanceText}</Text>
                            </View>
                        </View>

                        <View style={{ flex: 1 }} />

                        <TouchableOpacity
                            style={styles.infoButton}
                            onPress={() => router.push(`/tournament/${tournamentId}`)}
                        >
                            <Text style={styles.infoText}>Info</Text>
                        </TouchableOpacity>
                    </View>
                </View>

            </ImageBackground>
        </View>
    );
};


export default TournamentView;

const getStyles = (theme: ReturnType<typeof useTheme>) => StyleSheet.create({
    rowContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    card: {
        width: '100%',
        alignSelf: 'center',
        borderRadius: 20,
        overflow: 'hidden',
        marginBottom: 20,
    },
    image: {
        width: "100%",
        height: 210,
        justifyContent: "flex-end",
    },
    overlay: {
        backgroundColor: theme.tournamentCard,
        padding: 18,
    },
    title: {
        color: "#000",
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 8,
        width: 200,
    },
    detailsRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        width: 130,
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

