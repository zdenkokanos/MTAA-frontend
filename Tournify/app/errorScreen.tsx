import { useLocalSearchParams, router } from 'expo-router';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import LottieView from 'lottie-react-native';
import NetInfo from '@react-native-community/netinfo';
import { useState, useEffect } from 'react';
import { useTheme } from '@/themes/theme';

export default function ErrorScreen() {
    const { message } = useLocalSearchParams<{ message: string }>();
    const [loading, setLoading] = useState(false);
    const [isConnected, setIsConnected] = useState<boolean | null>(null);

    const theme = useTheme();
    const isBW = theme.id === 'blackWhiteTheme';

    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
            setIsConnected(state.isConnected);
        });

        // Cleanup on unmount
        return () => unsubscribe();
    }, []);

    const handleGoHome = () => {
        if (!isConnected) return;

        setLoading(true);
        setTimeout(() => {
            router.push('/');
        }, 200);
    };

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: theme.background }}>
            <LottieView
                source={require('../assets/animations/nettworkLost.json')}
                autoPlay
                loop
                style={{ width: 200, height: 200 }}
            />
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginTop: 20, color: theme.text }}>
                {isConnected === false ? 'No Internet Connection' : 'Oops! Something went wrong.'}
            </Text>
            <Text style={{ marginTop: 10, color: 'red', textAlign: 'center' }}>{message}</Text>

            <TouchableOpacity
                onPress={handleGoHome}
                disabled={loading || isConnected === false}
                activeOpacity={0.7}
                style={{
                    marginTop: 30,
                    backgroundColor: loading || isConnected === false ? '#6c757d' : '#007bff',
                    paddingVertical: 10,
                    paddingHorizontal: 20,
                    borderRadius: 8,
                }}
            >
                {loading ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={{ color: 'white', fontSize: 16 }}>
                        {isConnected === false ? 'Offline' : 'Go to Home'}
                    </Text>
                )}
            </TouchableOpacity>
        </View>
    );
}
