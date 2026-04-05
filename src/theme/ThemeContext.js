import React, { createContext, useState, useContext } from 'react';
import { themes } from './colors';

// Create the context
const ThemeContext = createContext();

// Create the provider component
export const ThemeProvider = ({ children }) => {
    // Set 'dark' as the default theme mode
    const [themeMode, setThemeMode] = useState('dark');
    
    // Function to change the theme later from settings
    const toggleTheme = (mode) => {
        setThemeMode(mode);
    };

    // Get the actual color values based on the selected mode
    const currentTheme = themes[themeMode];

    return (
        <ThemeContext.Provider value={{ currentTheme, themeMode, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

// Custom hook to easily use the theme in any screen
export const useTheme = () => useContext(ThemeContext);
