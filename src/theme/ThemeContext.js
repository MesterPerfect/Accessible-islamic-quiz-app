import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { themes } from './colors';

// Create the context
const ThemeContext = createContext();
const THEME_KEY = '@app_theme_mode';

// Create the provider component
export const ThemeProvider = ({ children }) => {
    // Set 'dark' as the default theme mode
    const [themeMode, setThemeMode] = useState('dark');
    
    // Load saved theme on app start
    useEffect(() => {
        const loadTheme = async () => {
            try {
                const savedTheme = await AsyncStorage.getItem(THEME_KEY);
                if (savedTheme) {
                    setThemeMode(savedTheme);
                }
            } catch (error) {
                // Ignore error, fallback to default
            }
        };
        loadTheme();
    }, []);

    // Function to change the theme and save it
    const toggleTheme = async (mode) => {
        setThemeMode(mode);
        try {
            await AsyncStorage.setItem(THEME_KEY, mode);
        } catch (error) {
            // Ignore error
        }
    };

    // Get the actual color values based on the selected mode
    const currentTheme = themes[themeMode] || themes.dark;

    return (
        <ThemeContext.Provider value={{ currentTheme, themeMode, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

// Custom hook to easily use the theme in any screen
export const useTheme = () => useContext(ThemeContext);
