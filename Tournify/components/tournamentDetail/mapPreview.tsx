import React, { useMemo } from 'react';
import { Text, StyleSheet, TouchableOpacity, Linking, Platform, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useTheme } from '@/themes/theme';

interface Props {
    latitude: number;
    longitude: number;
    tournamentName: string;
}

export default function MapPreview({ latitude, longitude, tournamentName }: Props) {

    const openInMaps = (lat: number, lng: number, label: string) => {
        const url = Platform.select({
            ios: `http://maps.apple.com/?ll=${lat},${lng}&q=${encodeURIComponent(label)}`,
            android: `geo:${lat},${lng}?q=${lat},${lng}(${encodeURIComponent(label)})`,
        });
        if (url) {
            Linking.openURL(url);
        }
    };

    const theme = useTheme();
    const styles = useMemo(() => getStyles(theme), [theme]);
    const isBW = theme.id === 'blackWhiteTheme';

    return (
        <>
            <Text style={styles.title}>Map</Text>
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => openInMaps(latitude, longitude, tournamentName)}
            >
                <View style={styles.mapWrapper}>
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
                        {isBW && <View style={styles.overlay} />}
                        <Marker coordinate={{ latitude, longitude }} title={tournamentName} />
                    </MapView>
                </View>
            </TouchableOpacity>
        </>
    );
}

const getStyles = (theme: ReturnType<typeof useTheme>) => StyleSheet.create({
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
    mapWrapper: {
        position: 'relative',
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: 24,
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(20, 20, 20, 0.6)',
        zIndex: 2,
    },
});
