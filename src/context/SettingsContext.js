import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Create the context
const SettingsContext = createContext();

const SOUND_KEY = '@app_sound_enabled';
const HAPTICS_KEY = '@app_haptics_enabled';

// Create the provider component
export const SettingsProvider = ({ children }) => {
    // Default settings are true (enabled)
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [hapticsEnabled, setHapticsEnabled] = useState(true);

    // Load saved settings on app start
    useEffect(() => {
        const loadSettings = async () => {
            try {
                const savedSound = await AsyncStorage.getItem(SOUND_KEY);
                const savedHaptics = await AsyncStorage.getItem(HAPTICS_KEY);
                
                if (savedSound !== null) setSoundEnabled(JSON.parse(savedSound));
                if (savedHaptics !== null) setHapticsEnabled(JSON.parse(savedHaptics));
            } catch (error) {
                // Ignore error, defaults will be used
            }
        };
        loadSettings();
    }, []);

    // Toggle functions
    const toggleSound = async () => {
        const newValue = !soundEnabled;
        setSoundEnabled(newValue);
        try {
            await AsyncStorage.setItem(SOUND_KEY, JSON.stringify(newValue));
        } catch (error) {
            // Ignore error
        }
    };

    const toggleHaptics = async () => {
        const newValue = !hapticsEnabled;
        setHapticsEnabled(newValue);
        try {
            await AsyncStorage.setItem(HAPTICS_KEY, JSON.stringify(newValue));
        } catch (error) {
            // Ignore error
        }
    };

    return (
        <SettingsContext.Provider value={{ 
            soundEnabled, 
            toggleSound, 
            hapticsEnabled, 
            toggleHaptics 
        }}>
            {children}
        </SettingsContext.Provider>
    );
};

// Custom hook to use settings anywhere
export const useSettings = () => useContext(SettingsContext);
