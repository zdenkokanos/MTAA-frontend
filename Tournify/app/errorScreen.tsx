import { useLocalSearchParams } from 'expo-router';
import { View, Text, Button } from 'react-native';

export default function ErrorScreen() {
    const { message } = useLocalSearchParams<{ message: string }>();
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Oops! Something went wrong.</Text>
            <Text style={{ marginTop: 10, color: 'red' }}>{message}</Text>
        </View>
    );
}
