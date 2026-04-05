import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, AccessibilityInfo } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, FontAwesome } from '@expo/vector-icons';
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
        calculateResult,
        lives,
        hintUsed,
        useHint,
        showFeedback,
        selectedAnswer,
        isAnswerCorrect,
        nextQuestion
    } = useQuizEngine(questions, 30);

    // State to hold multiple disabled indices for dynamic 50/50 hint
    const [disabledHintIndices, setDisabledHintIndices] = useState([]);

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
                wrongQuestions: result.wrongQuestions
            });
        }
    }, [isFinished]);

    // Enhanced Hint Logic: Leaves exactly 2 options (1 correct, 1 wrong)
    useEffect(() => {
        if (hintUsed && currentQuestion && currentQuestion.answers) {
            const wrongIndices = [];
            currentQuestion.answers.forEach((ans, idx) => {
                if (ans.t !== 1) wrongIndices.push(idx);
            });
            
            // Calculate how many wrong answers to remove to leave exactly 2 total options
            const numToRemove = Math.max(1, currentQuestion.answers.length - 2);
            
            // Shuffle wrong indices and take the required amount
            const shuffledWrong = wrongIndices.sort(() => 0.5 - Math.random());
            setDisabledHintIndices(shuffledWrong.slice(0, numToRemove));
        } else {
            setDisabledHintIndices([]);
        }
    }, [hintUsed, currentQuestion]);

    // Accessibility announcements
    useEffect(() => {
        if (currentQuestion && !isFinished && !showFeedback) {
            const remainingQuestions = questions.length - (currentIndex + 1);
            const msg = `سؤال ${currentIndex + 1} من ${questions.length}. تبقى ${remainingQuestions} أسئلة. السؤال هو: ${currentQuestion.q}`;
            setTimeout(() => AccessibilityInfo.announceForAccessibility(msg), 500);
        }
    }, [currentIndex, currentQuestion, isFinished, showFeedback]);

    useEffect(() => {
        if (showFeedback && currentQuestion && currentQuestion.answers) {
            const correctAnswerText = currentQuestion.answers.find(a => a.t === 1)?.answer || '';
            const msg = isAnswerCorrect 
                ? "أحسنت! إجابة صحيحة." 
                : `إجابة خاطئة. الإجابة الصحيحة هي: ${correctAnswerText}`;
            AccessibilityInfo.announceForAccessibility(msg);
        }
    }, [showFeedback]);

    // Safety check for malformed question data
    if (!currentQuestion || !currentQuestion.answers || isFinished) return null; 

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: currentTheme.background }]}>
            
            {/* Header: Lives, Timer, Progress */}
            <View style={styles.header}>
                <View style={styles.livesContainer} accessible={true} accessibilityLabel={`تبقى لديك ${lives} محاولات`}>
                    {[...Array(3)].map((_, i) => (
                        <FontAwesome 
                            key={i} 
                            name={i < lives ? "heart" : "heart-o"} 
                            size={22} 
                            color={i < lives ? currentTheme.wrong : currentTheme.textSecondary} 
                            style={{ marginHorizontal: 2 }}
                        />
                    ))}
                </View>

                <Text style={[styles.timer, { color: timeLeft < 10 ? currentTheme.wrong : currentTheme.text }]} accessible={true} accessibilityLabel={`الوقت المتبقي ${timeLeft} ثانية`}>
                    <Feather name="clock" size={18} /> {timeLeft}s
                </Text>

                <Text style={[styles.progress, { color: currentTheme.text }]} accessible={true} accessibilityLabel={`سؤال ${currentIndex + 1} من ${questions.length}`}>
                    {currentIndex + 1} / {questions.length}
                </Text>
            </View>

            {/* Question Card */}
            <View style={styles.questionContainer} accessible={true}>
                <Text style={[styles.questionText, { color: currentTheme.text }]}>
                    {currentQuestion.q}
                </Text>
            </View>

            {/* Answers */}
            <View style={styles.answersContainer}>
                {currentQuestion.answers.map((ans, index) => {
                    const isHintDisabled = disabledHintIndices.includes(index);
                    
                    // Determine styling based on state
                    let bgColor = currentTheme.surface;
                    let textColor = currentTheme.primary;
                    let borderColor = '#444444';

                    if (showFeedback) {
                        if (ans.t === 1) {
                            bgColor = currentTheme.correct;
                            textColor = '#FFF';
                            borderColor = currentTheme.correct;
                        } else if (selectedAnswer === ans) {
                            bgColor = currentTheme.wrong;
                            textColor = '#FFF';
                            borderColor = currentTheme.wrong;
                        }
                    }

                    return (
                        <TouchableOpacity
                            key={index}
                            style={[
                                styles.answerButton, 
                                { backgroundColor: bgColor, borderColor },
                                isHintDisabled && { opacity: 0.1 }
                            ]}
                            onPress={() => handleAnswer(ans)}
                            disabled={showFeedback || isHintDisabled}
                            accessible={true}
                            accessibilityRole="button"
                            accessibilityLabel={`إجابة ${index + 1}: ${ans.answer}`}
                            accessibilityState={{ disabled: isHintDisabled }}
                        >
                            <Text style={[styles.answerText, { color: textColor }]}>
                                {index + 1}. {ans.answer}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>

            {/* Hint Button */}
            <TouchableOpacity 
                style={[styles.hintButton, { backgroundColor: hintUsed ? currentTheme.surface : currentTheme.secondary }]}
                onPress={useHint}
                disabled={hintUsed || showFeedback}
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel="استخدام مساعدة لحذف إجابات خاطئة"
            >
                <Feather name="flag" size={18} color={hintUsed ? currentTheme.textSecondary : '#000'} />
                <Text style={[styles.hintText, { color: hintUsed ? currentTheme.textSecondary : '#000' }]}>
                    {hintUsed ? 'تم استخدام المساعدة (50/50)' : 'حذف إجابات خاطئة (50/50)'}
                </Text>
            </TouchableOpacity>

            {/* Feedback Overlay */}
            {showFeedback && (
                <View style={[styles.overlay, { backgroundColor: 'rgba(0,0,0,0.8)' }]}>
                    <View style={[styles.feedbackModal, { backgroundColor: currentTheme.surface }]}>
                        <View style={[styles.iconCircle, { backgroundColor: isAnswerCorrect ? currentTheme.correct : currentTheme.wrong }]}>
                            <Feather name={isAnswerCorrect ? "check" : "x"} size={50} color="#FFF" />
                        </View>
                        
                        <Text style={[styles.feedbackTitle, { color: currentTheme.text }]}>
                            {isAnswerCorrect ? 'أحسنت! إجابة صحيحة 🎉' : 'للأسف إجابة خاطئة'}
                        </Text>
                        
                        {!isAnswerCorrect && (
                            <View style={styles.correctAnswerBox}>
                                <Text style={[styles.correctAnswerLabel, { color: currentTheme.textSecondary }]}>الإجابة الصحيحة هي:</Text>
                                <Text style={[styles.correctAnswerValue, { color: currentTheme.correct }]}>
                                    {currentQuestion.answers.find(a => a.t === 1)?.answer || 'غير متوفرة'}
                                </Text>
                            </View>
                        )}
                        
                        <TouchableOpacity 
                            style={[styles.nextButton, { backgroundColor: currentTheme.primary }]}
                            onPress={nextQuestion}
                            accessible={true}
                            accessibilityRole="button"
                            accessibilityLabel={lives <= 0 && !isAnswerCorrect ? "إنهاء الاختبار" : "السؤال التالي"}
                        >
                            <Text style={styles.nextButtonText}>
                                {lives <= 0 && !isAnswerCorrect ? "إنهاء الاختبار" : "المتابعة"}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16 },
    header: { flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, paddingHorizontal: 5 },
    livesContainer: { flexDirection: 'row-reverse' },
    timer: { fontSize: 18, fontFamily: 'Cairo_Bold' },
    progress: { fontSize: 18, fontFamily: 'Cairo_Bold' },
    questionContainer: { padding: 20, marginBottom: 20, borderRadius: 12, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
    questionText: { fontSize: 22, textAlign: 'center', lineHeight: 32, fontFamily: 'Cairo_Bold' },
    answersContainer: { flex: 1 },
    answerButton: { padding: 16, borderRadius: 10, marginBottom: 12, borderWidth: 2 },
    answerText: { fontSize: 18, textAlign: 'center', fontFamily: 'Cairo_Bold' },
    hintButton: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'center', padding: 15, borderRadius: 12, marginTop: 10 },
    hintText: { fontSize: 16, fontFamily: 'Cairo_Bold', marginRight: 10 },
    
    // Overlay Styles
    overlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', zIndex: 100 },
    feedbackModal: { width: '85%', padding: 30, borderRadius: 20, alignItems: 'center', elevation: 10 },
    iconCircle: { width: 80, height: 80, borderRadius: 40, justifyContent: 'center', alignItems: 'center', marginBottom: 20, marginTop: -60, elevation: 5 },
    feedbackTitle: { fontSize: 24, fontFamily: 'Cairo_Bold', textAlign: 'center', marginBottom: 20 },
    correctAnswerBox: { width: '100%', padding: 15, backgroundColor: 'rgba(0,0,0,0.05)', borderRadius: 10, marginBottom: 20, alignItems: 'center' },
    correctAnswerLabel: { fontSize: 14, fontFamily: 'Cairo_Regular', marginBottom: 5 },
    correctAnswerValue: { fontSize: 18, fontFamily: 'Cairo_Bold', textAlign: 'center' },
    nextButton: { width: '100%', padding: 15, borderRadius: 12, alignItems: 'center' },
    nextButtonText: { color: '#FFF', fontSize: 18, fontFamily: 'Cairo_Bold' }
});
