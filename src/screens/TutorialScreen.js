import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, AccessibilityInfo } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, Ionicons, MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../theme/ThemeContext';

const { width } = Dimensions.get('window');

export default function TutorialScreen({ navigation }) {
    const { currentTheme } = useTheme();
    const [step, setStep] = useState(0);

    const steps = [
        {
            icon: <Feather name="book-open" size={80} color="#0f766e" />,
            title: "مرحباً بك في أسئلة إسلامية!",
            content: "اختبر معلوماتك في العلوم الشرعية من مصادر موثوقة من موقع الدرر السنية.",
            color: "#0f766e"
        },
        {
            icon: <Feather name="target" size={80} color="#f59e0b" />,
            title: "اختر مجالك",
            content: "ستجد 6 مجالات علمية: التفسير، العقيدة، الحديث، الفقه، التاريخ، واللغة العربية.",
            color: "#f59e0b"
        },
        {
            icon: <Feather name="zap" size={80} color="#ec4899" />,
            title: "تدرج في المستويات",
            content: "ابدأ بالمستوى الأول، واحصل على 80% لفتح المستوى التالي. كل مستوى أصعب من السابق!",
            color: "#ec4899"
        },
        {
            icon: <Ionicons name="trophy-outline" size={80} color="#8b5cf6" />,
            title: "اربح النقاط والإنجازات",
            content: "أجب بسرعة وحافظ على تتابع الإجابات الصحيحة لتعزيز مستواك وفتح جميع المستويات.",
            color: "#8b5cf6"
        },
        // New step for accessibility support
        {
            icon: <MaterialIcons name="accessibility-new" size={80} color="#3b82f6" />,
            title: "دعم إمكانية الوصول",
            content: "التطبيق مصمم بالكامل ليدعم قارئات الشاشة لتوفير تجربة لعب ممتعة وسهلة للجميع.",
            color: "#3b82f6"
        }
    ];

    // Accessibility: Announce the new content when the step changes
    useEffect(() => {
        const announcementMessage = `${steps[step].title}. ${steps[step].content}`;
        // Add a slight delay to ensure the UI has transitioned before speaking
        const timeoutId = setTimeout(() => {
            AccessibilityInfo.announceForAccessibility(announcementMessage);
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [step]);

    const finishTutorial = async () => {
        try {
            await AsyncStorage.setItem('@has_seen_tutorial', 'true');
        } catch (error) {
            // Ignore storage errors
        }
        navigation.replace('Home');
    };

    const nextStep = () => {
        if (step < steps.length - 1) {
            setStep(s => s + 1);
        } else {
            finishTutorial();
        }
    };

    const prevStep = () => {
        if (step > 0) setStep(s => s - 1);
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: currentTheme.background }]}>
            <TouchableOpacity 
                style={styles.closeBtn} 
                onPress={finishTutorial}
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel="تخطي التعليمات"
            >
                <Feather name="x" size={30} color={currentTheme.textSecondary} />
            </TouchableOpacity>

            <View style={styles.contentContainer} accessible={true}>
                <View style={[styles.iconContainer, { backgroundColor: `${steps[step].color}15` }]}>
                    {steps[step].icon}
                </View>
                
                <Text style={[styles.title, { color: steps[step].color }]}>{steps[step].title}</Text>
                <Text style={[styles.description, { color: currentTheme.text }]}>{steps[step].content}</Text>

                <View style={styles.dotsContainer} accessible={true} accessibilityLabel={`صفحة ${step + 1} من ${steps.length}`}>
                    {steps.map((_, idx) => (
                        <View 
                            key={idx} 
                            style={[
                                styles.dot, 
                                { backgroundColor: idx === step ? steps[step].color : currentTheme.surface },
                                idx === step && styles.activeDot
                            ]} 
                        />
                    ))}
                </View>
            </View>

            <View style={styles.buttonsContainer}>
                {step > 0 ? (
                    <TouchableOpacity 
                        style={[styles.btn, { backgroundColor: currentTheme.surface }]} 
                        onPress={prevStep}
                        accessible={true}
                        accessibilityRole="button"
                        accessibilityLabel="العودة للصفحة السابقة"
                    >
                        <Text style={[styles.btnText, { color: currentTheme.text }]}>السابق</Text>
                    </TouchableOpacity>
                ) : (
                    <View style={styles.btnPlaceholder} />
                )}

                <TouchableOpacity 
                    style={[styles.btn, { backgroundColor: steps[step].color }]} 
                    onPress={nextStep}
                    accessible={true}
                    accessibilityRole="button"
                    accessibilityLabel={step === steps.length - 1 ? 'ابدأ اللعب الآن' : 'الانتقال للصفحة التالية'}
                >
                    <Text style={[styles.btnText, { color: '#FFF' }]}>
                        {step === steps.length - 1 ? 'ابدأ الآن!' : 'التالي'}
                    </Text>
                </TouchableOpacity>
            </View>

            <View style={styles.progressBarBg} accessible={false}>
                <View style={[styles.progressBarFill, { width: `${((step + 1) / steps.length) * 100}%`, backgroundColor: steps[step].color }]} />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    closeBtn: { position: 'absolute', top: 50, right: 20, zIndex: 10, padding: 10 },
    contentContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 30 },
    iconContainer: { width: 150, height: 150, borderRadius: 75, justifyContent: 'center', alignItems: 'center', marginBottom: 40 },
    title: { fontSize: 28, fontFamily: 'Cairo_Bold', textAlign: 'center', marginBottom: 15 },
    description: { fontSize: 18, fontFamily: 'Cairo_Regular', textAlign: 'center', lineHeight: 28 },
    dotsContainer: { flexDirection: 'row-reverse', marginTop: 40 },
    dot: { width: 10, height: 10, borderRadius: 5, marginHorizontal: 5 },
    activeDot: { width: 25 },
    buttonsContainer: { flexDirection: 'row-reverse', justifyContent: 'space-between', paddingHorizontal: 30, marginBottom: 30 },
    btn: { paddingVertical: 15, paddingHorizontal: 30, borderRadius: 12, elevation: 2 },
    btnPlaceholder: { width: 100 },
    btnText: { fontSize: 18, fontFamily: 'Cairo_Bold', textAlign: 'center' },
    progressBarBg: { height: 6, width: '100%', backgroundColor: 'rgba(0,0,0,0.1)' },
    progressBarFill: { height: '100%' }
});
