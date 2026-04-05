import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SettingsContext = createContext();

const SOUND_KEY = '@app_sound_enabled';
const HAPTICS_KEY = '@app_haptics_enabled';
const REVIEW_KEY = '@app_review_enabled'; // New key for review setting

export const SettingsProvider = ({ children }) => {
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [hapticsEnabled, setHapticsEnabled] = useState(true);
    const [reviewEnabled, setReviewEnabled] = useState(true); // Default is true

    useEffect(() => {
        const loadSettings = async () => {
            try {
                const savedSound = await AsyncStorage.getItem(SOUND_KEY);
                const savedHaptics = await AsyncStorage.getItem(HAPTICS_KEY);
                const savedReview = await AsyncStorage.getItem(REVIEW_KEY);
                
                if (savedSound !== null) setSoundEnabled(JSON.parse(savedSound));
                if (savedHaptics !== null) setHapticsEnabled(JSON.parse(savedHaptics));
                if (savedReview !== null) setReviewEnabled(JSON.parse(savedReview));
            } catch (error) {
                // Ignore errors
            }
        };
        loadSettings();
    }, []);

    const toggleSound = async () => {
        const newValue = !soundEnabled;
        setSoundEnabled(newValue);
        await AsyncStorage.setItem(SOUND_KEY, JSON.stringify(newValue));
    };

    const toggleHaptics = async () => {
        const newValue = !hapticsEnabled;
        setHapticsEnabled(newValue);
        await AsyncStorage.setItem(HAPTICS_KEY, JSON.stringify(newValue));
    };

    const toggleReview = async () => {
        const newValue = !reviewEnabled;
        setReviewEnabled(newValue);
        await AsyncStorage.setItem(REVIEW_KEY, JSON.stringify(newValue));
    };

    return (
        <SettingsContext.Provider value={{ 
            soundEnabled, 
            toggleSound, 
            hapticsEnabled, 
            toggleHaptics,
            reviewEnabled,
            toggleReview
        }}>
            {children}
        </SettingsContext.Provider>
    );
};

export const useSettings = () => useContext(SettingsContext);
