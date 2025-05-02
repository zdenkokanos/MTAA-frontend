import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function TabLayout() {
    return (
        <Tabs screenOptions={{
            headerShown: false, tabBarStyle: {
                height: 95,
                paddingTop: 10,
            },
        }} >
            <Tabs.Screen name="home" options={{ title: "Home", tabBarIcon: ({ focused, color }) => <Ionicons name="home" size={24} color={color} /> }} />
            <Tabs.Screen name="explore" options={{ title: "Explore", tabBarIcon: ({ focused, color }) => <Ionicons name="search" size={24} color={color} /> }} />
            <Tabs.Screen name="events" options={{ title: "Events", tabBarIcon: ({ focused, color }) => <Ionicons name="calendar" size={24} color={color} /> }} />
            <Tabs.Screen name="create" options={{ title: "Create", tabBarIcon: ({ focused, color }) => <Ionicons name="add-circle" size={24} color={color} /> }} />
        </Tabs>);
}
