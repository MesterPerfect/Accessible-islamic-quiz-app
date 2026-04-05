import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../theme/ThemeContext';
import questionsData from '../data/questions.json';
import { getStatistics } from '../utils/statistics';

// Safely extract the categories array to prevent "non-iterable" errors
const categoriesList = Array.isArray(questionsData) 
    ? questionsData 
    : (questionsData.mainCategories || questionsData.default || []);

export default function HomeScreen({ navigation }) {
    const { currentTheme } = useTheme();
    const [stats, setStats] = useState({ totalPoints: 0, quizzesPlayed: 0 });
    const [categoryProgress, setCategoryProgress] = useState({});

    useFocusEffect(
        useCallback(() => {
            const loadData = async () => {
                const currentStats = await getStatistics();
                setStats(currentStats);

                const progressObj = {};
                // Use the safely extracted categoriesList
                for (const cat of categoriesList) {
                    try {
                        const savedLevel = await AsyncStorage.getItem(`@progress_${cat.id}_${cat.slug}`);
                        let completed = 0;
                        if (savedLevel === 'level2') completed = 1;
                        if (savedLevel === 'level3') completed = 2;
                        if (savedLevel === 'completed') completed = 3;
                        progressObj[cat.id] = completed;
                    } catch (e) {
                        progressObj[cat.id] = 0;
                    }
                }
                setCategoryProgress(progressObj);
            };
            loadData();
        }, [])
    );

    const renderHeader = () => (
        <View style={styles.header}>
            <View 
                style={[styles.achievementsPill, { backgroundColor: currentTheme.surface, borderColor: currentTheme.primary }]}
                accessible={true}
                accessibilityRole="text"
                accessibilityLabel={`إجمالي النقاط: ${stats.totalPoints} نقطة. والمستويات المكتملة: ${stats.quizzesPlayed}.`}
            >
                <Text style={[styles.pillText, { color: currentTheme.text }]}>🏆 {stats.totalPoints}</Text>
                <Text style={[styles.pillDivider, { color: currentTheme.textSecondary }]}>|</Text>
                <Text style={[styles.pillText, { color: currentTheme.text }]}>⭐ {stats.quizzesPlayed}</Text>
            </View>

            <Text style={[styles.mainDescription, { color: currentTheme.textSecondary }]}>
                مرحباً بك في تطبيق الأسئلة الإسلامية. اختر تصنيفاً لتبدأ الاختبار وتختبر معلوماتك.
            </Text>

            <TouchableOpacity 
                style={[styles.statsCard, { backgroundColor: currentTheme.primary }]}
                onPress={() => navigation.navigate('Statistics')}
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel="عرض الإحصائيات والإنجازات الخاصة بي مفصلة"
            >
                <View style={styles.statsCardContent}>
                    <Ionicons name="stats-chart" size={28} color="#FFFFFF" />
                    <Text style={styles.statsCardText}>إحصائياتي وإنجازاتي</Text>
                </View>
                <Feather name="chevron-left" size={24} color="#FFFFFF" />
            </TouchableOpacity>
        </View>
    );

    const renderCategory = ({ item }) => {
        const completedLevels = categoryProgress[item.id] || 0;

        return (
            <TouchableOpacity 
                style={[styles.categoryContainer, { backgroundColor: currentTheme.surface }]}
                onPress={() => navigation.navigate('Topics', { category: item })}
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel={`${item.title || item.arabicName}. ${item.description}. اكتمل ${completedLevels} من أصل 3 مستويات.`}
            >
                <View style={styles.categoryHeader}>
                    <Text style={[styles.categoryTitle, { color: currentTheme.primary }]}>
                        {item.title || item.arabicName}
                    </Text>
                    
                    <View style={styles.categoryMeta} accessible={false}>
                        <View style={styles.progressDots}>
                            {[1, 2, 3].map(i => (
                                <View 
                                    key={i} 
                                    style={[
                                        styles.dot, 
                                        i <= completedLevels ? { backgroundColor: currentTheme.secondary } : { backgroundColor: 'transparent', borderColor: currentTheme.textSecondary, borderWidth: 1 }
                                    ]} 
                                />
                            ))}
                        </View>
                        <Text style={[styles.progressText, { color: currentTheme.textSecondary }]}>
                            {completedLevels}/3
                        </Text>
                    </View>
                </View>

                <Text style={[styles.categoryDescription, { color: currentTheme.textSecondary }]}>
                    {item.description}
                </Text>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: currentTheme.background }]}>
            <FlatList
                data={categoriesList} // Use the safely extracted list here
                keyExtractor={(item, index) => item.id ? item.id.toString() : index.toString()}
                renderItem={renderCategory}
                ListHeaderComponent={renderHeader}
                contentContainerStyle={styles.listContainer}
                showsVerticalScrollIndicator={false}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingVertical: 16,
        alignItems: 'center',
    },
    achievementsPill: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 30,
        borderWidth: 1,
        marginBottom: 20,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    pillText: {
        fontSize: 18,
        fontFamily: 'Cairo_Bold',
    },
    pillDivider: {
        marginHorizontal: 15,
        fontSize: 18,
    },
    mainDescription: {
        fontSize: 16,
        textAlign: 'center',
        lineHeight: 24,
        fontFamily: 'Cairo_Regular',
        marginBottom: 20,
        paddingHorizontal: 10,
    },
    statsCard: {
        width: '100%',
        flexDirection: 'row-reverse',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 20,
        borderRadius: 16,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        marginBottom: 10,
    },
    statsCardContent: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
    },
    statsCardText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontFamily: 'Cairo_Bold',
        marginRight: 12,
    },
    listContainer: {
        padding: 16,
    },
    categoryContainer: {
        padding: 20,
        borderRadius: 12,
        marginBottom: 16,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    categoryHeader: {
        flexDirection: 'row-reverse',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    categoryTitle: {
        fontSize: 22,
        fontFamily: 'Cairo_Bold',
        flex: 1,
        textAlign: 'right',
    },
    categoryMeta: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    progressDots: {
        flexDirection: 'row-reverse',
        marginBottom: 5,
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginHorizontal: 2,
    },
    progressText: {
        fontSize: 12,
        fontFamily: 'Cairo_Bold',
    },
    categoryDescription: {
        fontSize: 14,
        textAlign: 'right',
        lineHeight: 22,
        fontFamily: 'Cairo_Regular',
    }
});
