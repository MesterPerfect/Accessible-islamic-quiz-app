import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeContext';
import { saveProgress } from '../utils/storage';
import { useSettings } from '../context/SettingsContext';
import { updateStatistics } from '../utils/statistics';

export default function ResultScreen({ route, navigation }) {
    const { score, totalQuestions, percentage, passed, categoryId, topicSlug, currentLevelKey, wrongQuestions } = route.params;
    const { currentTheme } = useTheme();
    const { reviewEnabled } = useSettings();

    useEffect(() => {
        // 1. Update statistics for every completed quiz
        updateStatistics({
            totalQuestions,
            correctAnswers: score,
            wrongAnswers: totalQuestions - score
        });
        // 2. Save progress if passed
        if (passed) {
            const currentNum = parseInt(currentLevelKey.replace('level', ''));
            const nextLevelKey = `level${currentNum + 1}`;
            saveProgress(categoryId, topicSlug, nextLevelKey);
        }
    }, [passed]);

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: currentTheme.background }]}>
            <View style={[styles.card, { backgroundColor: currentTheme.surface }]} accessible={true}>
                <Text style={[styles.title, { color: currentTheme.text }]}>
                    {passed ? "ممتاز!" : "حاول مرة أخرى"}
                </Text>
                
                <Text style={[styles.percentageText, { color: passed ? currentTheme.correct : currentTheme.wrong }]}>
                    {percentage.toFixed(0)}%
                </Text>

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
                    الإجابات الصحيحة: {score} / {totalQuestions}
                </Text>

                <Text style={[styles.messageText, { color: currentTheme.textSecondary }]}>
                    {passed ? "لقد نجحت في فتح المستوى التالي بنجاح." : "تحتاج إلى 80% أو أعلى لفتح المستوى التالي."}
                </Text>
            </View>

            <View style={styles.buttonContainer}>
                {/* Honor the reviewEnabled setting from context */}
                {!passed && reviewEnabled && wrongQuestions && wrongQuestions.length > 0 && (
                    <TouchableOpacity
                        style={[styles.reviewButton, { backgroundColor: currentTheme.secondary }]}
                        onPress={() => navigation.navigate('Review', { wrongQuestions })}
                        accessible={true}
                        accessibilityRole="button"
                        accessibilityLabel="مراجعة الإجابات الخاطئة"
                    >
                        <Text style={[styles.reviewButtonText, { color: '#000000' }]}>مراجعة الأخطاء</Text>
                    </TouchableOpacity>
                )}

                <TouchableOpacity
                    style={[styles.button, { backgroundColor: currentTheme.primary }]}
                    onPress={() => navigation.navigate('Levels', { 
                        topic: { slug: topicSlug, name: '' }, 
                        categoryId 
                    })}
                    accessible={true}
                    accessibilityRole="button"
                >
                    <Text style={styles.buttonText}>العودة للمستويات</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.secondaryButton, { borderColor: currentTheme.primary, borderWidth: 2 }]}
                    onPress={() => navigation.popToTop()} 
                    accessible={true}
                    accessibilityRole="button"
                >
                    <Text style={[styles.secondaryButtonText, { color: currentTheme.primary }]}>الرئيسية</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, justifyContent: 'center' },
    card: { padding: 30, borderRadius: 20, alignItems: 'center', elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 6, marginBottom: 30 },
    title: { fontSize: 32, marginBottom: 20, fontFamily: 'Cairo_Bold' },
    percentageText: { fontSize: 48, marginBottom: 15, fontFamily: 'Cairo_Bold' },
    progressBarBackground: { height: 15, width: '100%', borderRadius: 10, overflow: 'hidden', marginBottom: 25 },
    progressBarFill: { height: '100%', borderRadius: 10 },
    detailsText: { fontSize: 20, marginBottom: 10, fontFamily: 'Cairo_Bold' },
    messageText: { fontSize: 16, textAlign: 'center', marginTop: 10, lineHeight: 24, fontFamily: 'Cairo_Regular' },
    buttonContainer: { width: '100%', gap: 12 },
    button: { padding: 16, borderRadius: 12, alignItems: 'center' },
    secondaryButton: { padding: 16, borderRadius: 12, alignItems: 'center' },
    reviewButton: { padding: 16, borderRadius: 12, alignItems: 'center', elevation: 2 },
    buttonText: { color: '#FFFFFF', fontSize: 18, fontFamily: 'Cairo_Bold' },
    secondaryButtonText: { fontSize: 18, fontFamily: 'Cairo_Bold' },
    reviewButtonText: { fontSize: 18, fontFamily: 'Cairo_Bold' }
});
