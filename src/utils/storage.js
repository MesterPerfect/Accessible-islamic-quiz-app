import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveProgress = async (categoryId, topicSlug, nextLevelKey) => {
    try {
        const key = `@progress_${categoryId}_${topicSlug}`;
        let valueToSave = nextLevelKey;

        // If the user just passed level 3, the ResultScreen sends 'level4'.
        // We translate this to 'completed' as expected by HomeScreen and LevelsScreen.
        if (nextLevelKey === 'level4') {
            valueToSave = 'completed';
        }

        // Fetch current progress to prevent downgrading 
        // (e.g., replaying level 1 shouldn't lock level 3 if it's already unlocked)
        const currentProgress = await AsyncStorage.getItem(key);
        
        if (currentProgress === 'completed') {
            return; // Already fully unlocked, do nothing
        }
        if (currentProgress === 'level3' && valueToSave === 'level2') {
            return; // Prevent downgrading progress
        }

        await AsyncStorage.setItem(key, valueToSave);
    } catch (e) {
        // Ignore error
        console.error("Error saving progress:", e);
    }
};

// We don't strictly need getProgress here anymore since HomeScreen and LevelsScreen 
// read directly using their own specific keys, but we can keep a generic getter if needed elsewhere.
export const getSpecificProgress = async (categoryId, topicSlug) => {
    try {
        const key = `@progress_${categoryId}_${topicSlug}`;
        return await AsyncStorage.getItem(key);
    } catch (e) {
        return null;
    }
};
