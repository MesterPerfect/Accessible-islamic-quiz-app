import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';

export default function ReviewScreen({ route, navigation }) {
    const { wrongQuestions } = route.params;
    const { currentTheme } = useTheme();

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: currentTheme.background }]}>
            {/* Custom Header */}
            <View style={styles.header}>
                <TouchableOpacity 
                    onPress={() => navigation.goBack()} 
                    style={styles.backButton}
                    accessible={true}
                    accessibilityRole="button"
                    accessibilityLabel="العودة لشاشة النتيجة"
                >
                    <Feather name="arrow-right" size={28} color={currentTheme.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: currentTheme.text }]}>مراجعة الأخطاء</Text>
                <View style={{ width: 28 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {wrongQuestions.map((q, index) => {
                    // Find the correct answer where t === 1
                    const correctAnswer = q.answers.find(ans => ans.t === 1)?.answer;
                    
                    return (
                        <View key={index} style={[styles.card, { backgroundColor: currentTheme.surface }]} accessible={true}>
                            <Text style={[styles.questionText, { color: currentTheme.text }]}>
                                {index + 1}. {q.q}
                            </Text>
                            <View style={[styles.answerContainer, { backgroundColor: currentTheme.correct + '20' }]}>
                                <Feather name="check-circle" size={20} color={currentTheme.correct} />
                                <Text style={[styles.correctAnswerText, { color: currentTheme.correct }]}>
                                    {correctAnswer}
                                </Text>
                            </View>
                        </View>
                    );
                })}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 15 },
    headerTitle: { fontSize: 22, fontFamily: 'Cairo_Bold' },
    backButton: { padding: 5 },
    scrollContent: { padding: 16, paddingBottom: 40 },
    card: { padding: 20, borderRadius: 12, marginBottom: 16, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
    questionText: { fontSize: 18, fontFamily: 'Cairo_Bold', textAlign: 'right', marginBottom: 15, lineHeight: 28 },
    answerContainer: { flexDirection: 'row-reverse', alignItems: 'center', padding: 12, borderRadius: 8 },
    correctAnswerText: { fontSize: 16, fontFamily: 'Cairo_Bold', marginRight: 10, flex: 1, textAlign: 'right' }
});
