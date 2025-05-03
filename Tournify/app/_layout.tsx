import { Stack } from "expo-router";
import { View } from "react-native";
import Toast from "react-native-toast-message";
import { useFonts } from 'expo-font';

export default function RootLayout() {
  
  const [fontsLoaded] = useFonts({
    Koulen: require('../assets/fonts/Koulen-Regular.ttf'),
  });

  return (
    <>
      <View style={{ zIndex: 9999 }}>
        <Toast topOffset={70} />
      </View>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="welcome" />
        <Stack.Screen name="login" />
        <Stack.Screen name="register" />
        <Stack.Screen name="preferencesCity" />
        <Stack.Screen name="preferencesSport" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="ticket/[ticketId]" />
      </Stack>
    </>
  );
}
