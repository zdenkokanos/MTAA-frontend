import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import API_BASE_URL from '@/config/config';

export async function registerPushToken(userId: number) {
    if (!Device.isDevice) return;

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
    }

    if (finalStatus !== 'granted') {
        console.warn('Push notification permission not granted');
        return;
    }

    const tokenData = await Notifications.getExpoPushTokenAsync();
    const token = tokenData.data;

    console.log('Expo Push Token:', token);

    try {
        await fetch(`${API_BASE_URL}/push-token`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId,           // your numeric user ID
                token,            // the Expo push token
                platform: Device.osName || null,  // optional metadata
            }),
        });
        console.log('Push token sent to backend.');
    } catch (err) {
        console.error('Failed to send push token:', err);
    }
}
