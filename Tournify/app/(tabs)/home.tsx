import API_BASE_URL from "../../config/config"; // If placed in "config/"
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Text, View, StyleSheet } from "react-native";
import { useState, useEffect } from "react";

export default function HomeScreen() {
    const [userId, setUserId] = useState<string | null>(null);
    const [userData, setUserData] = useState<any>(null);

    useEffect(() => {
        const getUserData = async () => {
            try {
                const storedUserId = await AsyncStorage.getItem("userId");
                if (storedUserId) {
                    setUserId(storedUserId);
                    await fetchUserData(storedUserId); // Fetch user info immediately
                }
            } catch (error) {
                console.error("Error getting userId:", error);
            }
        };

        getUserData();
    }, []);

    const fetchUserData = async (id: string) => {
        const backendUrl = `${API_BASE_URL}/users/info/${id}`;

        try {
            const response = await fetch(backendUrl, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });

            const data = await response.json();

            if (response.ok) {
                setUserData(data); // Store user info
            } else {
                alert(data.message || "Failed to fetch user data");
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
            alert("An error occurred, please try again.");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Home Screen</Text>
            <Text style={styles.text}>UserId: {userId ?? "Loading..."}</Text>

            {userData ? (
                <View style={styles.userInfo}>
                    <Text style={styles.text}>First Name: {userData.first_name}</Text>
                    <Text style={styles.text}>Last Name: {userData.last_name}</Text>
                    <Text style={styles.text}>Gender: {userData.gender}</Text>
                    <Text style={styles.text}>Age: {userData.age}</Text>
                    <Text style={styles.text}>Email: {userData.email}</Text>
                    <Text style={styles.text}>Preferred Longitude: {userData.preferred_longitude}</Text>
                    <Text style={styles.text}>Preferred Latitude: {userData.preferred_latitude}</Text>
                    <Text style={styles.text}>Created At: {userData.created_at}</Text>
                </View>
            ) : (
                <Text style={styles.text}>Loading user data...</Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#4FC1FF",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
    },
    text: {
        color: "#fff",
        fontSize: 18,
        marginVertical: 5,
    },
    userInfo: {
        marginTop: 20,
    },
});