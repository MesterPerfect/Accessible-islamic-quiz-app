import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Share, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';
import { saveProgress } from '../utils/storage';
import { useSettings } from '../context/SettingsContext';

export default function ResultScreen({ route, navigation }) {
    const { score, totalQuestions, percentage, passed, categoryId, topicSlug, currentLevelKey, wrongQuestions } = route.params;
    const { currentTheme } = useTheme();
    const { reviewEnabled } = useSettings();

    useEffect(() => {
        if (passed) {
            const currentNum = parseInt(currentLevelKey.replace('level', ''));
            const nextLevelKey = `level${currentNum + 1}`;
            saveProgress(categoryId, topicSlug, nextLevelKey);
        }
    }, [passed]);

    // Dynamic Grading System
    const getGrade = () => {
        if (percentage >= 90) return { 
            text: "أحسنتَ!", 
            color: "#FFD700", // Gold
            icon: <Ionicons name="trophy" size={48} color="#FFD700" />, 
            message: "إجاباتك دقيقة، وتدلّ على تمكّنٍ واضح." 
        };
        if (passed) return { 
            text: "نتيجة طيبة", 
            color: currentTheme.correct, 
            icon: <Ionicons name="star" size={48} color={currentTheme.correct} />, 
            message: "تجاوزت الحدّ المطلوب بنجاح." 
        };
        if (percentage >= 50) return { 
            text: "مقبول", 
            color: "#F59E0B", // Orange
            icon: <Feather name="target" size={48} color="#F59E0B" />, 
            message: "مستواك متوسط، لكنك تحتاج 80% للنجاح." 
        };
        return { 
            text: "تحتاج إلى تحسين", 
            color: currentTheme.wrong, 
            icon: <Feather name="refresh-cw" size={48} color={currentTheme.wrong} />, 
            message: "راجع المادة جيداً ثم أعد المحاولة." 
        };
    };

    const grade = getGrade();

    // Share API Implementation
    const handleShare = async () => {
        try {
            const levelMap = { level1: 'المستوى الأول', level2: 'المستوى الثاني', level3: 'المستوى الثالث' };
            const levelName = levelMap[currentLevelKey] || '';
            const appLink = "https://play.google.com/store/apps/details?id=com.yourcompany.islamicquiz";
            const message = `حصلت على ${score}/${totalQuestions} (${percentage.toFixed(0)}%) في تطبيق الأسئلة الإسلامية - ${levelName}!\nهل يمكنك التغلب علي؟ 🏆\nحمّل التطبيق من هنا: ${appLink}`;
            
            await Share.share({ message });
        } catch (error) {
            console.log(error.message);
        }
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: currentTheme.background }]}>
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                
                {/* Hero Grade Card */}
                <View style={[styles.card, { backgroundColor: currentTheme.surface, borderColor: grade.color, borderWidth: 1 }]} accessible={true}>
                    <View style={styles.iconWrapper}>
                        {grade.icon}
                    </View>
                    
                    <Text style={[styles.title, { color: grade.color }]}>{grade.text}</Text>
                    <Text style={[styles.messageText, { color: currentTheme.textSecondary }]}>{grade.message}</Text>
                    
                    <Text style={[styles.percentageText, { color: passed ? currentTheme.correct : currentTheme.wrong }]}>
                        {percentage.toFixed(0)}%
                    </Text>

                    <View style={[styles.progressBarBackground, { backgroundColor: currentTheme.background }]}>
                        <View 
                            style={[
                                styles.progressBarFill, 
                                { width: `${percentage}%`, backgroundColor: passed ? currentTheme.correct : currentTheme.wrong }
                            ]} 
                        />
                    </View>
                    
                    <Text style={[styles.detailsText, { color: currentTheme.text }]}>
                        الإجابات الصحيحة: {score} / {totalQuestions}
                    </Text>
                </View>

                {/* Unlock Banner */}
                {passed ? (
                    <View style={[styles.banner, styles.passedBanner]} accessible={true} accessibilityLabel="مبروك، تم فتح المستوى التالي">
                        <View style={styles.bannerTextContainer}>
                            <Text style={styles.bannerTitle}>🎉 مبروك!</Text>
                            <Text style={styles.bannerSub}>
                                {currentLevelKey === 'level3' ? 'لقد أتممت جميع مستويات هذا القسم' : 'تم فتح المستوى التالي بنجاح'}
                            </Text>
                        </View>
                        <MaterialCommunityIcons name="lock-open-variant" size={32} color="#155724" />
                    </View>
                ) : (
                    <View style={[styles.banner, styles.failedBanner]} accessible={true} accessibilityLabel="المستوى التالي مقفل، تحتاج إلى 80 بالمئة لفتحه">
                        <View style={styles.bannerTextContainer}>
                            <Text style={styles.bannerTitleFailed}>🔒 المستوى مقفل</Text>
                            <Text style={styles.bannerSubFailed}>تحتاج إلى 80% أو أعلى لفتحه</Text>
                        </View>
                        <MaterialCommunityIcons name="lock" size={32} color="#721C24" />
                    </View>
                )}

                {/* Actions Container */}
                <View style={styles.buttonContainer}>
                    
                    {/* Share Button */}
                    <TouchableOpacity
                        style={[styles.actionButton, { backgroundColor: '#0ea5e9' }]} // Blue color for share
                        onPress={handleShare}
                        accessible={true}
                        accessibilityRole="button"
                    >
                        <Feather name="share-2" size={20} color="#FFF" style={styles.btnIcon} />
                        <Text style={styles.buttonText}>شارك النتيجة</Text>
                    </TouchableOpacity>

                    {/* Review Mistakes Button */}
                    {!passed && reviewEnabled && wrongQuestions && wrongQuestions.length > 0 && (
                        <TouchableOpacity
                            style={[styles.actionButton, { backgroundColor: currentTheme.secondary }]}
                            onPress={() => navigation.navigate('Review', { wrongQuestions })}
                            accessible={true}
                            accessibilityRole="button"
                        >
                            <Feather name="list" size={20} color="#000" style={styles.btnIcon} />
                            <Text style={[styles.buttonText, { color: '#000' }]}>مراجعة الأخطاء</Text>
                        </TouchableOpacity>
                    )}

                    <TouchableOpacity
                        style={[styles.actionButton, { backgroundColor: currentTheme.primary }]}
                        onPress={() => navigation.navigate('Levels', { topic: { slug: topicSlug, name: '' }, categoryId })}
                        accessible={true}
                        accessibilityRole="button"
                    >
                        <Feather name="layers" size={20} color="#FFF" style={styles.btnIcon} />
                        <Text style={styles.buttonText}>العودة للمستويات</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.actionButton, { backgroundColor: currentTheme.surface, borderWidth: 1, borderColor: currentTheme.textSecondary }]}
                        onPress={() => navigation.popToTop()} 
                        accessible={true}
                        accessibilityRole="button"
                    >
                        <Feather name="home" size={20} color={currentTheme.text} style={styles.btnIcon} />
                        <Text style={[styles.buttonText, { color: currentTheme.text }]}>الرئيسية</Text>
                    </TouchableOpacity>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    scrollContent: { padding: 20, paddingBottom: 40 },
    card: { padding: 30, borderRadius: 20, alignItems: 'center', elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 6, marginBottom: 20 },
    iconWrapper: { marginBottom: 15 },
    title: { fontSize: 32, marginBottom: 10, fontFamily: 'Cairo_Bold', textAlign: 'center' },
    messageText: { fontSize: 16, textAlign: 'center', marginBottom: 20, lineHeight: 24, fontFamily: 'Cairo_Regular' },
    percentageText: { fontSize: 48, marginBottom: 15, fontFamily: 'Cairo_Bold' },
    progressBarBackground: { height: 12, width: '100%', borderRadius: 10, overflow: 'hidden', marginBottom: 20 },
    progressBarFill: { height: '100%', borderRadius: 10 },
    detailsText: { fontSize: 20, fontFamily: 'Cairo_Bold' },
    
    // Banner Styles
    banner: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between', padding: 20, borderRadius: 16, marginBottom: 25 },
    passedBanner: { backgroundColor: '#D4EDDA', borderColor: '#C3E6CB', borderWidth: 1 },
    failedBanner: { backgroundColor: '#F8D7DA', borderColor: '#F5C6CB', borderWidth: 1 },
    bannerTextContainer: { flex: 1, alignItems: 'flex-end', paddingRight: 15 },
    bannerTitle: { fontSize: 18, fontFamily: 'Cairo_Bold', color: '#155724' },
    bannerSub: { fontSize: 14, fontFamily: 'Cairo_Regular', color: '#155724', textAlign: 'right' },
    bannerTitleFailed: { fontSize: 18, fontFamily: 'Cairo_Bold', color: '#721C24' },
    bannerSubFailed: { fontSize: 14, fontFamily: 'Cairo_Regular', color: '#721C24', textAlign: 'right' },

    // Buttons
    buttonContainer: { width: '100%', gap: 12 },
    actionButton: { flexDirection: 'row-reverse', padding: 16, borderRadius: 12, alignItems: 'center', justifyContent: 'center', elevation: 2 },
    btnIcon: { marginLeft: 10 },
    buttonText: { color: '#FFFFFF', fontSize: 18, fontFamily: 'Cairo_Bold' }
});
