import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CircularProgress from 'react-native-circular-progress-indicator';
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
                
                <View style={styles.progressContainer} accessible={true} accessibilityLabel={`Your score is ${percentage.toFixed(0)} percent`}>
                    <CircularProgress
                        value={percentage}
                        radius={80}
                        duration={1500}
                        progressValueColor={currentTheme.text}
                        maxValue={100}
                        title={'%'}
                        titleColor={currentTheme.textSecondary}
                        titleStyle={{ fontWeight: 'bold' }}
                        activeStrokeColor={passed ? currentTheme.correct : currentTheme.wrong}
                        inActiveStrokeColor={currentTheme.background}
                        inActiveStrokeOpacity={0.5}
                        inActiveStrokeWidth={15}
                        activeStrokeWidth={15}
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

            <TouchableOpacity
                style={[styles.button, { backgroundColor: currentTheme.primary }]}
                onPress={() => navigation.navigate('Levels', { 
                    topic: { slug: topicSlug, name: '' }, 
                    categoryId 
                })}
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel="Back to Levels"
            >
                <Text style={styles.buttonText}>Back to Levels</Text>
            </TouchableOpacity>
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
    progressContainer: {
        marginVertical: 25,
        alignItems: 'center',
        justifyContent: 'center',
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
    button: {
        padding: 18,
        borderRadius: 12,
        alignItems: 'center',
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 20,
        fontWeight: 'bold',
    }
});
