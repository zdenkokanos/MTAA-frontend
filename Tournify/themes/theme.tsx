import { useColorScheme } from 'react-native';

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
};

export const darkTheme = {
    background: '#222222',
    text: '#ffffff',
    mutedText: '#aaaaaa',
    card: '#222222',
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
};

export const useTheme = () => {
    const scheme = useColorScheme();
    return scheme === 'dark' ? darkTheme : lightTheme;
};