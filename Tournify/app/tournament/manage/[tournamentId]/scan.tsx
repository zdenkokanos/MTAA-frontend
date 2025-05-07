import { CameraView, useCameraPermissions } from 'expo-camera';
import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API_BASE_URL from '@/config/config';

export default function QRScannerScreen() {
    const [permission, requestPermission] = useCameraPermissions();
    const [scanned, setScanned] = useState(false);
    const [scanResult, setScanResult] = useState<'valid' | 'invalid' | null>(null);
    const router = useRouter();
    const { tournamentId } = useLocalSearchParams();

    const handleBarcodeScanned = async ({ data }: { data: string }) => {
        if (scanned) return;
        setScanned(true);

        try {
            const token = await AsyncStorage.getItem('token');
            if (!token) throw new Error("Missing token");

            const res = await fetch(`${API_BASE_URL}/tournaments/${tournamentId}/check-tickets`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ code: data })
            });

            setScanResult(res.ok ? 'valid' : 'invalid');
        } catch (error) {
            console.error("QR Scan Error:", error);
            setScanResult('invalid');
        } finally {
            setTimeout(() => {
                setScanned(false);
                setScanResult(null);
            }, 4000);
        }
    };

    useEffect(() => {
        if (!permission?.granted) {
            requestPermission();
        }
    }, []);

    if (!permission) return <View style={styles.container} />;

    if (!permission.granted) {
        return (
            <View style={styles.centered}>
                <Text style={styles.permissionText}>We need permission to access the camera</Text>
                <TouchableOpacity onPress={requestPermission} style={styles.permissionButton}>
                    <Text style={styles.permissionButtonText}>Grant Permission</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <CameraView
                style={StyleSheet.absoluteFill}
                onBarcodeScanned={handleBarcodeScanned}
                barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
            />

            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                <Ionicons name="arrow-back" size={28} color="#fff" />
            </TouchableOpacity>

            <View style={styles.overlay}>
                <Text style={styles.scanText}>Scan QR Code</Text>
                <View style={styles.scannerGuide} />
            </View>

            {scanResult && (
                <View
                    style={[styles.resultOverlay, scanResult === 'valid' ? styles.valid : styles.invalid]}
                >
                    <Ionicons
                        name={scanResult === 'valid' ? 'checkmark' : 'close'}
                        size={64}
                        color="#fff"
                        style={{ marginBottom: 10 }}
                    />
                    <Text style={styles.resultText}>
                        {scanResult === 'valid' ? 'VALID' : 'INVALID'}
                    </Text>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    permissionText: {
        color: '#fff',
        fontSize: 16,
        marginBottom: 12,
    },
    permissionButton: {
        padding: 12,
        backgroundColor: '#2ecc71',
        borderRadius: 8,
    },
    permissionButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scanText: {
        color: '#fff',
        fontSize: 18,
        marginBottom: 10,
    },
    scannerGuide: {
        width: 200,
        height: 200,
        borderWidth: 3,
        borderColor: '#fff',
        borderRadius: 16,
    },
    backButton: {
        position: 'absolute',
        top: 50,
        left: 20,
        zIndex: 10,
        backgroundColor: 'rgba(0,0,0,0.5)',
        padding: 10,
        borderRadius: 25,
    },
    resultOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
    valid: {
        backgroundColor: 'rgba(46, 204, 113, 0.95)',
    },
    invalid: {
        backgroundColor: 'rgba(231, 76, 60, 0.95)',
    },
    resultText: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#fff',
    },
});
