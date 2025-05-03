import { useLocalSearchParams } from 'expo-router';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useEffect, useState } from 'react';
import API_BASE_URL from '@/config/config';

import TicketCard from "@/components/ticketCard";

export default function CategoryTournamentsScreen() {
    const { category } = useLocalSearchParams<{ category: string }>();
    const [tournaments, setTournaments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const categoryParts = category?.split('-');
    const categoryId = categoryParts?.[0];
    const categoryName = categoryParts?.slice(1).join(' '); 

    const userId = 11; // !!!!!


    useEffect(() => {
        const fetchTournaments = async () => {
          try {
            const response = await fetch(`${API_BASE_URL}/tournaments?category_id=${categoryId}&user_id=${userId}`);
            const data = await response.json();
            setTournaments(data);
          } catch (error) {
            console.error('Error loading tournaments:', error);
          } finally {
            setLoading(false);
          }
        };
    
        if (categoryId) {
          fetchTournaments();
        }
    }, [categoryId]);

    return(
        <View style={styles.container}>
        <Text style={styles.title}>Tournaments for {categoryName}</Text>
        {loading ? (
            <Text>Loading...</Text>
        ) : (
            <FlatList
            data={tournaments}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
                <View style={styles.card}>
                <Text style={styles.cardTitle}>{item.tournament_name}</Text>
                <Text style={styles.cardInfo}>{item.date}</Text>
                </View>
            )}
            />
        )}
        </View>
    );

};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
    card: { padding: 16, backgroundColor: '#eee', marginBottom: 10, borderRadius: 8 },
    cardTitle: { fontSize: 18, fontWeight: '600' },
    cardInfo: { fontSize: 14, color: '#555' },
});