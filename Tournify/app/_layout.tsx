import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="welcome" />
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
      <Stack.Screen name="preferencesCity" />
      <Stack.Screen name="preferencesSport" />
      <Stack.Screen name="(tabs)" />
    </Stack>);
}
