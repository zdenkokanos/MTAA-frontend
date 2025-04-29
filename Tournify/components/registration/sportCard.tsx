import React from 'react';
import { TouchableOpacity, Image, Text, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type SportCardProps = {
  title: string;
  image: any;
  selected: boolean;
  onPress: () => void;
};

export default function SportCard({ title, image, selected, onPress }: SportCardProps) {
  return (
    <TouchableOpacity style={[styles.card]} onPress={onPress}>

        <View style={styles.imageWrapper}>
            <Image source={ image } style={styles.image} />
            {selected && (
                <View style={styles.overlay}>
                    <Ionicons name="checkmark-circle-sharp" size={50} color="#eee" />
                </View>
            )}
        </View>
        <Text style={styles.title}>{title}</Text>

    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '45%',
    margin: '2.5%',
    backgroundColor: '#fff',
    borderRadius: 16,
    alignItems: 'center',
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 12,
    marginBottom: 10,
  },
  imageWrapper: {
    position: 'relative', 
    width: 145,
    height: 145,
    borderRadius: 12,
    overflow: 'hidden',
  },
  title: {
    marginTop: 10,
    fontWeight: 'bold',
    fontSize: 18,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
