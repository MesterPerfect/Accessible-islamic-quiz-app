import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeContext';
import { saveProgress } from '../utils/storage';

export default function ResultScreen({ route, navigation }) {
    const { score, totalQuestions, percentage, passed, categoryId, topicSlug, currentLevelKey } = route.params;
    const { currentTheme } = useTheme();

    useEffect(() => {
        if (passed) {
            // Calculate next level key (e.g., level1 -> level2)
            const currentNum = parseInt(currentLevelKey.replace('level', ''));
            const nextLevelKey = `level${currentNum + 1}`;
            
            // Save progress to unlock next level
            saveProgress(categoryId, topicSlug, nextLevelKey);
        }
    }, [passed]);

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: currentTheme.background }]}>
            <View style={[styles.card, { backgroundColor: currentTheme.surface }]} accessible={true}>
                <Text style={[styles.title, { color: currentTheme.text }]}>
                    {passed ? "Excellent!" : "Try Again"}
                </Text>
                
                <Text style={[styles.percentageText, { color: passed ? currentTheme.correct : currentTheme.wrong }]}>
                    {percentage.toFixed(0)}%
                </Text>

                {/* Custom Simple Progress Bar */}
                <View style={[styles.progressBarBackground, { backgroundColor: currentTheme.background }]}>
                    <View 
                        style={[
                            styles.progressBarFill, 
                            { 
                                width: `${percentage}%`, 
                                backgroundColor: passed ? currentTheme.correct : currentTheme.wrong 
                            }
                        ]} 
                    />
                </View>
                
                <Text style={[styles.detailsText, { color: currentTheme.text }]}>
                    Correct Answers: {score} / {totalQuestions}
                </Text>

                {passed ? (
                    <Text style={[styles.messageText, { color: currentTheme.textSecondary }]}>
                        You have successfully unlocked the next level.
                    </Text>
                ) : (
                    <Text style={[styles.messageText, { color: currentTheme.textSecondary }]}>
                        You need 80% or higher to unlock the next level.
                    </Text>
                )}
            </View>

            <View style={styles.buttonContainer}>
                {/* Back to Levels Button */}
                <TouchableOpacity
                    style={[styles.button, { backgroundColor: currentTheme.primary }]}
                    onPress={() => navigation.navigate('Levels', { 
                        topic: { slug: topicSlug, name: '' }, 
                        categoryId 
                    })}
                    accessible={true}
                    accessibilityRole="button"
                    accessibilityLabel="Back to levels list"
                >
                    <Text style={styles.buttonText}>العودة للمستويات</Text>
                </TouchableOpacity>

                {/* Back to Home Button */}
                <TouchableOpacity
                    style={[styles.secondaryButton, { borderColor: currentTheme.primary, borderWidth: 2 }]}
                    onPress={() => navigation.popToTop()} 
                    accessible={true}
                    accessibilityRole="button"
                    accessibilityLabel="Back to main categories"
                >
                    <Text style={[styles.secondaryButtonText, { color: currentTheme.primary }]}>الرئيسية</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
    },
    card: {
        padding: 30,
        borderRadius: 20,
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        marginBottom: 30,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    percentageText: {
        fontSize: 48,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    progressBarBackground: {
        height: 15,
        width: '100%',
        borderRadius: 10,
        overflow: 'hidden',
        marginBottom: 25,
    },
    progressBarFill: {
        height: '100%',
        borderRadius: 10,
    },
    detailsText: {
        fontSize: 20,
        marginBottom: 10,
        fontWeight: '500',
    },
    messageText: {
        fontSize: 16,
        textAlign: 'center',
        marginTop: 10,
        lineHeight: 24,
    },
    buttonContainer: {
        width: '100%',
        gap: 12, 
    },
    button: {
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    secondaryButton: {
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    secondaryButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
    }
});
