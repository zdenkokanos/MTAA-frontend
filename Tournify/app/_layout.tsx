import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="welcome" />
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
      <Stack.Screen name="preferences-city" />
      <Stack.Screen name="preferences-sport" />
      <Stack.Screen name="(tabs)" />
    </Stack>);
}
