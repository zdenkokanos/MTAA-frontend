import React from 'react';
import { Text, StyleSheet, TouchableOpacity, Linking, Platform } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useTheme } from '@/themes/theme';

interface Props {
    latitude: number;
    longitude: number;
    tournamentName: string;
}

export default function MapPreview({ latitude, longitude, tournamentName }: Props) {
    const theme = useTheme();
    const styles = getStyles(theme);

    const openInMaps = (lat: number, lng: number, label: string) => {
        const url = Platform.select({
            ios: `http://maps.apple.com/?ll=${lat},${lng}&q=${encodeURIComponent(label)}`,
            android: `geo:${lat},${lng}?q=${lat},${lng}(${encodeURIComponent(label)})`,
        });
        if (url) {
            Linking.openURL(url);
        }
    };

    return (
        <>
            <Text style={styles.title}>Map</Text>
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => openInMaps(latitude, longitude, tournamentName)}
            >
                <MapView
                    style={styles.map}
                    initialRegion={{
                        latitude,
                        longitude,
                        latitudeDelta: 0.01,
                        longitudeDelta: 0.01,
                    }}
                    scrollEnabled={false}
                    zoomEnabled={false}
                    pitchEnabled={false}
                    rotateEnabled={false}
                >
                    <Marker coordinate={{ latitude, longitude }} title={tournamentName} />
                </MapView>
            </TouchableOpacity>
        </>
    );
}

const getStyles = (theme: ReturnType<typeof useTheme>) =>
    StyleSheet.create({
        title: {
            fontSize: 18,
            fontWeight: 'bold',
            color: theme.text,
            marginBottom: 12,
        },
        map: {
            width: '100%',
            height: 180,
            borderRadius: 12,
            marginBottom: 24,
            backgroundColor: '#eee',
        },
    });
