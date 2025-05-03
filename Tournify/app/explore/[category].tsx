import { useLocalSearchParams } from 'expo-router';
import { View, Text, StyleSheet, FlatList, SafeAreaView, Platform } from 'react-native';
import { useEffect, useMemo, useState } from 'react';
import API_BASE_URL from '@/config/config';

import TourenamentView from '@/components/explore/tournamentView'
import { useTheme } from "@/themes/theme";
import LottieView from 'lottie-react-native';

export default function CategoryTournamentsScreen() {
    const { category } = useLocalSearchParams<{ category: string }>();
    const [tournaments, setTournaments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const categoryParts = category?.split('-');
    const categoryId = categoryParts?.[0];
    const categoryName = categoryParts?.slice(1).join(' '); 

    const userId = 11; // !!!!!

    // TODO:
    // font, idcko, GPSko, search


    useEffect(() => {
        const fetchTournaments = async () => {
          try {
            const response = await fetch(`${API_BASE_URL}/tournaments?category_id=${categoryId}&user_id=${userId}`);
            const data = await response.json();

            setTournaments(Array.isArray(data) ? data : []);

          } catch (error) {
            console.error('Error loading tournaments:', error);
            setTournaments([]); // fallback 
          } finally {
            setLoading(false);
          }
        };
    
        if (categoryId) {
          fetchTournaments();
        }
    }, [categoryId]);

    const theme = useTheme();
    const styles = useMemo(() => getStyles(theme), [theme]);

    return(
        <SafeAreaView
            style={styles.safeArea}
        >
            <View style={styles.container}>
            <Text style={styles.title}>Tournaments for {categoryName}</Text>
            {loading ? (
                <Text>Loading...</Text>
            ) : tournaments.length === 0 ? (
                <View style={styles.animationContainer}>
                    <LottieView
                        source={require('@/assets/animations/notFound.json')}
                        autoPlay
                        loop={true}
                        style={styles.animation}
                        />
                    <Text style={styles.emptyText}>Sorry, no tournaments found.</Text>
                </View>
            ) : (
                <FlatList
                data={tournaments}
                keyExtractor={(item) => item.id.toString()}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                    <View>
                        <TourenamentView
                            title={item.tournament_name}
                            dateText={formatDateRelative(item.date)}
                            distanceText={`${item.distance} km from you`}
                            imageUrl={{ uri: `${API_BASE_URL}/category/images/${item.category_image}` }}
                            tournamentId={item.id}
                        />
                    </View>
                    )}
                    contentContainerStyle={{ paddingBottom: 20 }}
                    />
                )}
            </View>
        </SafeAreaView>
    );

};

function formatDateRelative(dateString: string): string {
    const today = new Date();
    const target = new Date(dateString);

    // Strip time from both dates to compare pure days
    const utcToday = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
    const utcTarget = Date.UTC(target.getFullYear(), target.getMonth(), target.getDate());

    const diffDays = Math.ceil((utcTarget - utcToday) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return "In the past";
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Tomorrow";

    return `in ${diffDays} days`;
}

const getStyles = (theme: ReturnType<typeof useTheme>) => StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: theme.background,
        paddingTop: Platform.OS === 'ios' ? 0 : 40,
    },
    container: { flex: 1, padding: 20 },
    title: { 
        fontSize: 24, 
        fontWeight: 'bold', 
        marginBottom: 20, 
        color: theme.text 
    },
    card: { 
        padding: 16, 
        backgroundColor: '#eee', 
        marginBottom: 10, 
        borderRadius: 8 
    },
    cardTitle: { 
        fontSize: 18, 
        fontWeight: '600' 
    },
    cardInfo: { 
        fontSize: 14, 
        color: '#555' 
    },
    emptyText: {
        textAlign: 'center',
        fontSize: 16,
        color: theme.text,
        fontStyle: 'italic',
    },
    animationContainer: {
        marginTop: 50,
        alignItems: 'center'
    },
    animation: {
        width: '90%',
        height: 200,
    },
      
});