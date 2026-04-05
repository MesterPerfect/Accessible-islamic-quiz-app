import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { themes } from '../theme/colors';
import { useQuizEngine } from '../hooks/useQuizEngine';
import { useTheme } from '../theme/ThemeContext';

export default function QuizScreen({ route, navigation }) {
    const { questions, levelKey, topicSlug, categoryId } = route.params;
    
    // Set default theme to dark
    const { currentTheme } = useTheme(); 
    
    // Initialize the quiz engine with the questions and 30 seconds timer
    const { 
        currentQuestion, 
        currentIndex, 
        timeLeft, 
        isFinished, 
        handleAnswer, 
        calculateResult 
    } = useQuizEngine(questions, 30);

    const onAnswerPress = async (isCorrect) => {
        // Pass settings for haptics
        await handleAnswer(isCorrect, { haptics: true });
    };

    // Render result view when finished
    if (isFinished) {
        const result = calculateResult();
        return (
            <SafeAreaView style={[styles.centeredContainer, { backgroundColor: currentTheme.background }]}>
                <Text style={[styles.title, { color: currentTheme.text }]}>End of Level</Text>
                <Text style={{ color: currentTheme.text, fontSize: 18, marginTop: 10 }}>
                    Score: {result.score} / {questions.length}
                </Text>
                <Text style={{ color: currentTheme.text, fontSize: 18, marginTop: 10 }}>
                    Percentage: {result.percentage.toFixed(2)}%
                </Text>
                <TouchableOpacity 
                    style={[styles.button, { backgroundColor: currentTheme.primary }]}
                    onPress={() => navigation.goBack()}
                >
                    <Text style={styles.buttonText}>Go Back</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    if (!currentQuestion) {
        return null; 
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: currentTheme.background }]}>
            <View style={styles.header}>
                <Text style={[styles.timer, { color: currentTheme.text }]}>
                    Time: {timeLeft}s
                </Text>
                <Text style={[styles.progress, { color: currentTheme.text }]}>
                    {currentIndex + 1} / {questions.length}
                </Text>
            </View>

            <View style={styles.questionContainer}>
                <Text style={[styles.questionText, { color: currentTheme.text }]} accessible={true}>
                    {currentQuestion.q}
                </Text>
            </View>

            <View style={styles.answersContainer}>
                {currentQuestion.answers.map((ans, index) => (
                    <TouchableOpacity
                        key={index}
                        style={[styles.answerButton, { backgroundColor: currentTheme.surface }]}
                        onPress={() => onAnswerPress(ans.t === 1)}
                        accessible={true}
                        accessibilityRole="button"
                        accessibilityLabel={ans.answer}
                    >
                        <Text style={[styles.answerText, { color: currentTheme.primary }]}>
                            {ans.answer}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    centeredContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 24,
        paddingHorizontal: 8,
    },
    timer: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    progress: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    questionContainer: {
        padding: 20,
        marginBottom: 30,
        borderRadius: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    questionText: {
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
        lineHeight: 32,
    },
    answersContainer: {
        flex: 1,
    },
    answerButton: {
        padding: 18,
        borderRadius: 10,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#444444',
    },
    answerText: {
        fontSize: 18,
        textAlign: 'center',
        fontWeight: '500',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
    },
    button: {
        marginTop: 30,
        padding: 15,
        borderRadius: 8,
        width: '100%',
        alignItems: 'center',
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    }
});
