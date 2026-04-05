import AsyncStorage from '@react-native-async-storage/async-storage';

const STATS_KEY = '@app_statistics';

export const getStatistics = async () => {
    try {
        const data = await AsyncStorage.getItem(STATS_KEY);
        if (data !== null) {
            return JSON.parse(data);
        }
        // Default stats if none exist
        return {
            quizzesPlayed: 0,
            totalQuestions: 0,
            correctAnswers: 0,
            wrongAnswers: 0,
            totalPoints: 0
        };
    } catch (error) {
        return { quizzesPlayed: 0, totalQuestions: 0, correctAnswers: 0, wrongAnswers: 0, totalPoints: 0 };
    }
};

export const updateStatistics = async (quizData) => {
    try {
        const currentStats = await getStatistics();
        const newStats = {
            quizzesPlayed: currentStats.quizzesPlayed + 1,
            totalQuestions: currentStats.totalQuestions + quizData.totalQuestions,
            correctAnswers: currentStats.correctAnswers + quizData.correctAnswers,
            wrongAnswers: currentStats.wrongAnswers + quizData.wrongAnswers,
            // Calculate points (e.g., 10 points per correct answer)
            totalPoints: currentStats.totalPoints + (quizData.correctAnswers * 10) 
        };
        await AsyncStorage.setItem(STATS_KEY, JSON.stringify(newStats));
    } catch (error) {
        // Ignore error
    }
};
