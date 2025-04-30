import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import API_BASE_URL from "@/config/config";

import SportCard from '../components/registration/sportCard';
import StartButton from '../components/startButton';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function PreferencesSportScreen() {
  const [sportsData, setSportsData] = useState<any[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchSports = async () => {
      const storedToken = await AsyncStorage.getItem("token");
      if (storedToken) {
        setToken(storedToken);
      }
      try {
        const response = await fetch(`${API_BASE_URL}/tournaments/categories`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Sports could not be loaded.");
        }

        setSportsData(data);
      } catch (error) {
        console.error('❌ Error loading categories:', error);
      }
    };

    fetchSports();
  }, []);


  const toggleSelect = (title: string) => {
    if (selected.includes(title)) {
      setSelected(prev => prev.filter(item => item !== title));
    } else {
      setSelected(prev => [...prev, title]);
    }
  };

  return (
    <SafeAreaView
      style={styles.container}
      edges={['top', 'left', 'right', 'bottom']}
    >
      <View style={{ flex: 1 }}>
        <Text style={styles.heading}>
          Choose your{'\n'}
          <Text style={styles.bold}>Sports</Text>
        </Text>

        <FlatList
          data={sportsData}
          renderItem={({ item }) => (
            <SportCard
              title={item.category_name}
              image={{
                uri: `${API_BASE_URL}/uploads/${item.category_image}`,
                headers: { Authorization: `Bearer ${token}` },
              }}
              selected={selected.includes(item.category_name)}
              onPress={() => toggleSelect(item.category_name)}
            />
          )}
          keyExtractor={item => item.id.toString()}
          numColumns={2}
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
        />

      </View>
      <View style={styles.buttonContainer}>
        <StartButton title="Continue" onPress={() => router.push('/preferencesCity')} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: 24,
    marginBottom: 20,
  },
  bold: {
    fontWeight: 'bold',
    fontSize: 32,
  },
  buttonContainer: {
    marginTop: 10,
  },
});
