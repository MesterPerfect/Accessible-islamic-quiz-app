import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../theme/ThemeContext';

export default function LevelsScreen({ route, navigation }) {
    const { topic, categoryId } = route.params;
    const { currentTheme } = useTheme();
    const [unlockedLevels, setUnlockedLevels] = useState(['level1']);
    const [completedLevels, setCompletedLevels] = useState([]);

    useFocusEffect(
        useCallback(() => {
            const loadProgress = async () => {
                try {
                    const progress = await AsyncStorage.getItem(`@progress_${categoryId}_${topic.slug}`);
                    if (progress === 'level2') setUnlockedLevels(['level1', 'level2']);
                    else if (progress === 'level3') setUnlockedLevels(['level1', 'level2', 'level3']);
                    else if (progress === 'completed') {
                        setUnlockedLevels(['level1', 'level2', 'level3']);
                        setCompletedLevels(['level1', 'level2', 'level3']);
                    }
                } catch (e) {
                    // Default values remain
                }
            };
            loadProgress();
        }, [categoryId, topic.slug])
    );

    const getLevelConfig = (levelKey) => {
        switch (levelKey) {
            case 'level1':
                return { name: 'المستوى الأول', subtitle: 'سهل', stars: 1, color: currentTheme.primary };
            case 'level2':
                return { name: 'المستوى الثاني', subtitle: 'متوسط', stars: 2, color: '#f59e0b' }; // Orange/Gold
            case 'level3':
                return { name: 'المستوى الثالث', subtitle: 'صعب', stars: 3, color: currentTheme.wrong };
            default:
                return {};
        }
    };

    const renderLevelCard = (levelKey, index) => {
        const config = getLevelConfig(levelKey);
        const isUnlocked = unlockedLevels.includes(levelKey);
        const isCompleted = completedLevels.includes(levelKey);

        // Accessibility Label construction
        const accessibilityLabel = `${config.name}. الصعوبة: ${config.subtitle}. ${config.stars} نجوم. ${
            isUnlocked ? (isCompleted ? 'مكتمل بنجاح' : 'مفتوح للعب') : 'مغلق. أكمل المستوى السابق بـ 80% لفتحه'
        }`;

        return (
            <TouchableOpacity
                key={levelKey}
                style={[
                    styles.levelCard,
                    { backgroundColor: currentTheme.surface },
                    !isUnlocked && styles.lockedCard
                ]}
                onPress={() => isUnlocked && navigation.navigate('Quiz', { 
                    questions: topic.levels[levelKey], 
                    levelKey, 
                    topicSlug: topic.slug,
                    categoryId 
                })}
                disabled={!isUnlocked}
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel={accessibilityLabel}
            >
                <View style={styles.cardHeader}>
                    <View style={styles.titleGroup}>
                        <Text style={[styles.levelName, { color: isUnlocked ? currentTheme.text : currentTheme.textSecondary }]}>
                            {config.name}
                        </Text>
                        <Text style={[styles.levelSubtitle, { color: isUnlocked ? config.color : currentTheme.textSecondary }]}>
                            {config.subtitle}
                        </Text>
                    </View>
                    
                    {/* Status Icon */}
                    <View style={styles.statusIcon}>
                        {isCompleted ? (
                            <Ionicons name="checkmark-circle" size={32} color={currentTheme.correct} />
                        ) : isUnlocked ? (
                            <Ionicons name="play-circle" size={32} color={config.color} />
                        ) : (
                            <MaterialCommunityIcons name="lock" size={30} color={currentTheme.textSecondary} />
                        )}
                    </View>
                </View>

                {/* Stars Indicator */}
                <View style={styles.starsContainer} accessible={false}>
                    {[...Array(3)].map((_, i) => (
                        <FontAwesome 
                            key={i} 
                            name="star" 
                            size={20} 
                            color={i < config.stars ? (isUnlocked ? "#FFD700" : "#BDC3C7") : "transparent"} 
                            style={{ marginHorizontal: 2 }}
                        />
                    ))}
                </View>

                {!isUnlocked && (
                    <Text style={styles.unlockHint}>أكمل المستوى السابق بـ 80% لفتحه</Text>
                )}
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: currentTheme.background }]}>
            <View style={styles.topicHeader}>
                <Text style={[styles.topicTitle, { color: currentTheme.text }]}>{topic.name}</Text>
            </View>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {['level1', 'level2', 'level3'].map((level, index) => renderLevelCard(level, index))}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    topicHeader: { padding: 20, alignItems: 'center' },
    topicTitle: { fontSize: 24, fontFamily: 'Cairo_Bold', textAlign: 'center' },
    scrollContent: { padding: 16 },
    levelCard: {
        padding: 20,
        borderRadius: 16,
        marginBottom: 16,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    lockedCard: { opacity: 0.7, borderStyle: 'dashed', borderWidth: 1, borderColor: '#BDC3C7' },
    cardHeader: { flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
    titleGroup: { flex: 1, alignItems: 'flex-end' },
    levelName: { fontSize: 20, fontFamily: 'Cairo_Bold' },
    levelSubtitle: { fontSize: 14, fontFamily: 'Cairo_Bold', marginTop: -5 },
    statusIcon: { marginLeft: 15 },
    starsContainer: { flexDirection: 'row-reverse', marginBottom: 5 },
    unlockHint: { fontSize: 12, fontFamily: 'Cairo_Regular', color: '#E74C3C', textAlign: 'right', marginTop: 10 }
});
