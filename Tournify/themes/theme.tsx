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
};

export const darkTheme = {
    background: '#1E1E1E',
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
};

export const useTheme = () => {
    const scheme = useColorScheme();
    return scheme === 'dark' ? darkTheme : lightTheme;
};