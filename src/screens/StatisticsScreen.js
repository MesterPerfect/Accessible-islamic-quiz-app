import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';
import { getStatistics } from '../utils/statistics';

export default function StatisticsScreen({ navigation }) {
    const { currentTheme } = useTheme();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            const data = await getStatistics();
            setStats(data);
            setLoading(false);
        };
        
        // Add a focus listener to refresh stats every time the screen is opened
        const unsubscribe = navigation.addListener('focus', () => {
            fetchStats();
        });

        return unsubscribe;
    }, [navigation]);

    if (loading || !stats) {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor: currentTheme.background, justifyContent: 'center' }]}>
                <ActivityIndicator size="large" color={currentTheme.primary} />
            </SafeAreaView>
        );
    }

    // Calculate accuracy percentage
    const accuracy = stats.totalQuestions > 0 
        ? Math.round((stats.correctAnswers / stats.totalQuestions) * 100) 
        : 0;

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: currentTheme.background }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton} accessible={true} accessibilityLabel="العودة">
                    <Feather name="arrow-right" size={28} color={currentTheme.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: currentTheme.text }]}>إحصائياتي</Text>
                <View style={{ width: 28 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Points Card */}
                <View style={[styles.mainCard, { backgroundColor: currentTheme.primary }]}>
                    <Ionicons name="trophy" size={60} color="#FFD700" />
                    <Text style={styles.pointsLabel}>إجمالي النقاط</Text>
                    <Text style={styles.pointsValue}>{stats.totalPoints}</Text>
                </View>

                {/* Grid Stats */}
                <View style={styles.gridContainer}>
                    <View style={[styles.gridItem, { backgroundColor: currentTheme.surface }]}>
                        <Feather name="target" size={32} color={currentTheme.secondary} />
                        <Text style={[styles.gridValue, { color: currentTheme.text }]}>{accuracy}%</Text>
                        <Text style={[styles.gridLabel, { color: currentTheme.textSecondary }]}>نسبة الدقة</Text>
                    </View>

                    <View style={[styles.gridItem, { backgroundColor: currentTheme.surface }]}>
                        <Feather name="play-circle" size={32} color="#3b82f6" />
                        <Text style={[styles.gridValue, { color: currentTheme.text }]}>{stats.quizzesPlayed}</Text>
                        <Text style={[styles.gridLabel, { color: currentTheme.textSecondary }]}>اختبارات أُنجزت</Text>
                    </View>
                </View>

                <View style={styles.gridContainer}>
                    <View style={[styles.gridItem, { backgroundColor: currentTheme.surface }]}>
                        <Feather name="check-circle" size={32} color={currentTheme.correct} />
                        <Text style={[styles.gridValue, { color: currentTheme.correct }]}>{stats.correctAnswers}</Text>
                        <Text style={[styles.gridLabel, { color: currentTheme.textSecondary }]}>إجابات صحيحة</Text>
                    </View>

                    <View style={[styles.gridItem, { backgroundColor: currentTheme.surface }]}>
                        <Feather name="x-circle" size={32} color={currentTheme.wrong} />
                        <Text style={[styles.gridValue, { color: currentTheme.wrong }]}>{stats.wrongAnswers}</Text>
                        <Text style={[styles.gridLabel, { color: currentTheme.textSecondary }]}>إجابات خاطئة</Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 15 },
    headerTitle: { fontSize: 22, fontFamily: 'Cairo_Bold' },
    backButton: { padding: 5 },
    scrollContent: { padding: 20 },
    mainCard: { alignItems: 'center', padding: 30, borderRadius: 20, marginBottom: 20, elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 6 },
    pointsLabel: { fontSize: 18, fontFamily: 'Cairo_Bold', color: '#FFFFFF', marginTop: 10 },
    pointsValue: { fontSize: 48, fontFamily: 'Cairo_Bold', color: '#FFFFFF' },
    gridContainer: { flexDirection: 'row-reverse', justifyContent: 'space-between', marginBottom: 20 },
    gridItem: { flex: 1, alignItems: 'center', padding: 20, borderRadius: 16, marginHorizontal: 5, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
    gridValue: { fontSize: 24, fontFamily: 'Cairo_Bold', marginTop: 10 },
    gridLabel: { fontSize: 14, fontFamily: 'Cairo_Regular', marginTop: 5 }
});
