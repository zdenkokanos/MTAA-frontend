import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, SafeAreaView } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function WelcomeScreen() {

    

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView style={styles.wrapper} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                <ScrollView contentContainerStyle={styles.container}>
                    <View style={styles.row}>
                        <MaterialIcons style={styles.icon} name="edit" size={24} color="black" />
                        <Text style={styles.title}>Create Tournament</Text>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}


const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
    },
    wrapper: {
        flex: 1,
        backgroundColor: '#fff',
      },
    container: {
        padding: 24,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    icon: {
        marginTop: 4,
        marginRight: 10,
    },
    row: {
        flexDirection: 'row',
        textAlignVertical: 'center',
    }
});
