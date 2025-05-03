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
    createInputBackground: '#eee',
    createInputBorder: '#ddd',
    placeholderText: "#888"
};

export const darkTheme = {
    background: '#222',
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
    createInputBackground: '#333',
    createInputBorder: '#555',
    placeholderText: "#aaa"
};

export const useTheme = () => {
    const scheme = useColorScheme();
    return scheme === 'dark' ? darkTheme : lightTheme;
    // return darkTheme;
};