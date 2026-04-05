// src/utils/storage.js
import AsyncStorage from '@react-native-async-storage/async-storage';

const PROGRESS_KEY = '@user_progress';

export const saveProgress = async (categoryId, topicSlug, levelKey) => {
    try {
        const currentProgress = await getProgress() || {};
        // Mark level as completed
        if (!currentProgress[categoryId]) currentProgress[categoryId] = {};
        if (!currentProgress[categoryId][topicSlug]) currentProgress[categoryId][topicSlug] = [];
        
        if (!currentProgress[categoryId][topicSlug].includes(levelKey)) {
            currentProgress[categoryId][topicSlug].push(levelKey);
            await AsyncStorage.setItem(PROGRESS_KEY, JSON.stringify(currentProgress));
        }
    } catch (e) {
        // Handle error
    }
};

export const getProgress = async () => {
    const data = await AsyncStorage.getItem(PROGRESS_KEY);
    return data ? JSON.parse(data) : null;
};
