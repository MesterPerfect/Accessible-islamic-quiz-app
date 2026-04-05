	import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, AccessibilityInfo } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { themes } from '../theme/colors';
import { useQuizEngine } from '../hooks/useQuizEngine';
import { useTheme } from '../theme/ThemeContext';

export default function QuizScreen({ route, navigation }) {
    const { questions, levelKey, topicSlug, categoryId } = route.params;
    const { currentTheme } = useTheme(); 
    
    const { 
        currentQuestion, 
        currentIndex, 
        timeLeft, 
        isFinished, 
        handleAnswer, 
        calculateResult 
    } = useQuizEngine(questions, 30);

    const onAnswerPress = async (isCorrect) => {
        await handleAnswer(isCorrect, { haptics: false });
    };

    useEffect(() => {
        if (isFinished) {
            const result = calculateResult();
            navigation.replace('Result', {
                score: result.score,
                totalQuestions: questions.length,
                percentage: result.percentage,
                passed: result.passed,
                categoryId,
                topicSlug,
                currentLevelKey: levelKey,
                wrongQuestions: result.wrongQuestions // Add this line
            });
        }
    }, [isFinished]);

    // Accessibility: Announce question, progress, and remaining questions on change
    useEffect(() => {
        if (currentQuestion && !isFinished) {
            const remainingQuestions = questions.length - (currentIndex + 1);
            const announcementMessage = `Question ${currentIndex + 1} of ${questions.length}. ${remainingQuestions} questions remaining. The question is: ${currentQuestion.q}`;
            
            // Short delay to ensure transition is complete before TalkBack speaks
            setTimeout(() => {
                AccessibilityInfo.announceForAccessibility(announcementMessage);
            }, 500);
        }
    }, [currentIndex, currentQuestion, isFinished]);

    // Accessibility: Announce time remaining every 5 seconds
    useEffect(() => {
        if (timeLeft % 5 === 0 && timeLeft < 30 && timeLeft > 0 && !isFinished) {
            AccessibilityInfo.announceForAccessibility(`${timeLeft} seconds remaining`);
        }
    }, [timeLeft, isFinished]);

    if (!currentQuestion || isFinished) {
        return null; 
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: currentTheme.background }]}>
            <View style={styles.header}>
                <Text 
                    style={[styles.timer, { color: currentTheme.text }]}
                    accessible={true}
                    accessibilityLabel={`Time left: ${timeLeft} seconds`}
                >
                    Time: {timeLeft}s
                </Text>
                <Text 
                    style={[styles.progress, { color: currentTheme.text }]}
                    accessible={true}
                    accessibilityLabel={`Question ${currentIndex + 1} out of ${questions.length}`}
                >
                    {currentIndex + 1} / {questions.length}
                </Text>
            </View>

            <View style={styles.questionContainer} accessible={true}>
                <Text style={[styles.questionText, { color: currentTheme.text }]}>
                    {currentQuestion.q}
                </Text>
            </View>

            <View style={styles.answersContainer}>
                {currentQuestion.answers.map((ans, index) => {
                    const answerNumber = index + 1;
                    return (
                        <TouchableOpacity
                            key={index}
                            style={[styles.answerButton, { backgroundColor: currentTheme.surface }]}
                            onPress={() => onAnswerPress(ans.t === 1)}
                            accessible={true}
                            accessibilityRole="button"
                            // Accessibility: Include the answer number in the label
                            accessibilityLabel={`Answer ${answerNumber}: ${ans.answer}`}
                            accessibilityHint="Double tap to select this answer"
                        >
                            <Text style={[styles.answerText, { color: currentTheme.primary }]}>
                                {/* Visual Numbering */}
                                {answerNumber}. {ans.answer}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
        fontFamily: 'Cairo_Bold',
    },
    progress: {
        fontSize: 18,
        fontFamily: 'Cairo_Bold',
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
        textAlign: 'center',
        lineHeight: 32,
        fontFamily: 'Cairo_Bold',
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
        fontFamily: 'Cairo_Bold',
    }
});
