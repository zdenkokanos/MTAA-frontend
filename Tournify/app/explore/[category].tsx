import { useLocalSearchParams } from 'expo-router';
import { View, Text, StyleSheet, FlatList, SafeAreaView, Platform } from 'react-native';
import { useEffect, useMemo, useState } from 'react';
import API_BASE_URL from '@/config/config';
import useLocation from '@/hooks/useLocation';
import { getDistance } from 'geolib';

import TourenamentView from '@/components/explore/tournamentView'
import { useTheme } from "@/themes/theme";
import LottieView from 'lottie-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import OfflineBanner from '@/components/offlineBanner';

export default function CategoryTournamentsScreen() {
    const { latitude, longitude, error, getUserLocation } = useLocation();
    const { category } = useLocalSearchParams<{ category: string }>();
    const [rawTournaments, setRawTournaments] = useState<any[]>([]);
    const [tournaments, setTournaments] = useState<any[]>([]);
    const [usingActualGPS, setUsingActualGPS] = useState(false);

    const [loading, setLoading] = useState(true);

    const categoryParts = category?.split('-');
    const categoryId = categoryParts?.[0];
    const categoryName = categoryParts?.slice(1).join(' ');



    // TODO:
    // GPSko, search


    useEffect(() => {
        const fetchTournaments = async () => {

            const userId = await AsyncStorage.getItem("userId");

            try {
                const response = await fetch(`${API_BASE_URL}/tournaments?category_id=${categoryId}&user_id=${userId}`);
                const data = await response.json();

                setRawTournaments(Array.isArray(data) ? data : []);

            } catch (error) {
                console.error('Error loading tournaments:', error);
                setRawTournaments([]); // fallback 
            } finally {
                setLoading(false);
            }
        };

        if (categoryId) {
            fetchTournaments();
        }
    }, [categoryId]);

    useEffect(() => {
        getUserLocation();
    }, []);

    // console.log(rawTournaments); // keep to show it actually does something

    useEffect(() => {
        if (!rawTournaments.length) return;

        if (latitude !== 0 && longitude !== 0) { // if user allowed gps
            const updated = rawTournaments.map((tt) => {
                if (tt.latitude && tt.longitude) {
                    const distanceInMeters = getDistance(
                        { latitude, longitude },
                        { latitude: tt.latitude, longitude: tt.longitude }
                    );
                    const distanceInKm = Math.round((distanceInMeters / 1000) * 10) / 10;
                    return { ...tt, distance: distanceInKm };
                }
                return tt; // if doesnt have lat/long, keep as is
            });

            setTournaments(updated);
            setUsingActualGPS(true);
        } else { // GPS unavailable, use data from backend
            setTournaments(rawTournaments);
        }

    }, [rawTournaments, latitude, longitude]);

    const theme = useTheme();
    const styles = useMemo(() => getStyles(theme), [theme]);

    // console.log(tournaments); // keep to show it actually does something

    return (
        <SafeAreaView
            style={styles.safeArea}
        >
            <OfflineBanner />
            <View style={styles.container}>
                <Text style={styles.title}>Tournaments for <Text style={styles.titleSport}>{categoryName}</Text> </Text>
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
                    <>
                        <View style={styles.GPSinfo}>
                            {usingActualGPS ? (
                                <Text style={styles.GPSinfoText}>(Tournify is using your current location)</Text>
                            ) : (
                                <Text style={styles.GPSinfoText}>(Tournify is using your prefered location from profile)</Text>
                            )}
                        </View>
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
                    </>
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
    container: { flex: 1, padding: 10 },
    title: {
        fontSize: 24,
        fontWeight: 700,
        marginBottom: 20,
        color: theme.text,
    },
    titleSport: {
        textTransform: 'capitalize',
        fontWeight: 900
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
    GPSinfo: {
        alignItems: 'center',
        marginBottom: 15,
    },
    GPSinfoText: {
        color: '#999'
    },

});