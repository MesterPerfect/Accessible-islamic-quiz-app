// src/theme/colors.js

export const themes = {
    light: {
        background: '#F5F6FA',
        surface: '#FFFFFF',
        text: '#121212',
        primary: '#1E88E5',
        correct: '#4CAF50',
        wrong: '#F44336',
    },
    dark: {
        background: '#121212',
        surface: '#1E1E1E',
        text: '#FFFFFF',
        primary: '#90CAF9',
        correct: '#81C784',
        wrong: '#E57373',
    },
    highContrast: {
        background: '#000000',
        surface: '#000000',
        text: '#FFFFFF', // High contrast yellow or white
        primary: '#FFFF00', 
        correct: '#00FF00',
        wrong: '#FF0000',
        border: '#FFFFFF', // Required for visibility in high contrast
    }
};
