import { Text, View, StyleSheet } from "react-native";
import { Link } from "expo-router";
import { useThemeStore } from '@/stores/themeStore';
import { useEffect } from "react";

export default function Index() {
  const loadTheme = useThemeStore((s) => s.loadTheme);

  useEffect(() => {
    loadTheme();
  }, []);
  
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Hello World</Text>
      <Link href={"/welcome"} style={styles.button}>Go to the welcome screen</Link>
      <Link href={"/(tabs)/home"} style={styles.button}>Go to tabs</Link>
      <Link href="/login" style={styles.button}>
        Sign In
      </Link>
      <Link href="/register" style={styles.button}>
        Sign Up
      </Link>
      <Link href="/preferencesSport" style={styles.button}>
        preferences sport
      </Link>
      <Link href="/events" style={styles.button}>
        events
      </Link>
    </View>
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
  button: {
    color: "#000",
    fontSize: 20,
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
});
