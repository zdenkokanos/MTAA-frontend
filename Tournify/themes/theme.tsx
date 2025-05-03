import { useColorScheme } from 'react-native';
import { Appearance } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

export const lightTheme = {
    background: '#ffffff',
    text: '#000000',
    mutedText: '#666666',
    card: '#eeeeee',
    topBar: '#f0f0f0',
    dotActive: '#000000',
    dotInactive: '#cccccc',
    historyCard: '#ffffff',
    tournamentCard: "rgba(205, 205, 205, 0.75)",
    inputBackground: '#ffffff',
    inputBorder: '#cccccc',
    teamButton: '#f0f0f0',
    descriptionText: '#444444',
    createInputBackground: '#eee',
    createInputBorder: '#ddd',
    placeholderText: "#888",
    qrCode: "#000",
    headerTable: "#f5f5f5",
    tableRow: "#fff",
    tableBorder: '#ddd',
};

export const darkTheme = {
    background: '#222222',
    text: '#ffffff',
    mutedText: '#aaaaaa',
    card: '#2E2E2E',
    topBar: '#333333',
    dotActive: '#ffffff',
    dotInactive: '#555555',
    historyCard: '#333333',
    tournamentCard: "rgba(175, 175, 175, 0.75)",
    inputBackground: '#333333',
    inputBorder: '#555555',
    focusedBorder: '#66D9EF',
    teamButton: '#555555',
    descriptionText: '#eeeeee',
    createInputBackground: '#333',
    createInputBorder: '#555',
    placeholderText: "#aaa",
    qrCode: "#eee",
    headerTable: "#333333",
    tableRow: "#444444",
    tableBorder: '#555555',
};

export const useTheme = () => {
    const scheme = useColorScheme();
    // console.log('Appearance.getColorScheme():', Appearance.getColorScheme());
    // console.log("Android detected scheme:", scheme);
    return scheme === 'dark' ? darkTheme : lightTheme;
    // return darkTheme;
};