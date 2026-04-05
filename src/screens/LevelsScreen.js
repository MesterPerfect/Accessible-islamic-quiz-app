
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
import { themes } from '../theme/colors';
import { getProgress } from '../utils/storage';

export default function LevelsScreen({ route, navigation }) {
    const { topic, categoryId } = route.params;
    const currentTheme = themes.light; 
    const [unlockedLevels, setUnlockedLevels] = useState(['level1']);

    useEffect(() => {
        loadProgress();
    }, []);

    const loadProgress = async () => {
        const progress = await getProgress();
        let unlocked = ['level1']; 
        
        if (progress && progress[categoryId] && progress[categoryId][topic.slug]) {
            const savedLevels = progress[categoryId][topic.slug];
            unlocked = [...new Set([...unlocked, ...savedLevels])];
        }
        
        setUnlockedLevels(unlocked);
    };

    const renderLevel = ({ item, index }) => {
        const levelKey = item;
        const isUnlocked = unlockedLevels.includes(levelKey);
        const questions = topic.levelsData[levelKey];

        return (
            <TouchableOpacity
                style={[
                    styles.levelButton,
                    { backgroundColor: isUnlocked ? currentTheme.primary : currentTheme.surface },
                    !isUnlocked && styles.lockedButton
                ]}
                disabled={!isUnlocked}
                onPress={() => navigation.navigate('Quiz', { 
                    questions, 
                    levelKey, 
                    topicSlug: topic.slug, 
                    categoryId 
                })}
                accessible={true}
                accessibilityRole="button"
                accessibilityState={{ disabled: !isUnlocked }}
                accessibilityLabel={`مستوى ${index + 1}`}
                accessibilityHint={isUnlocked ? "انقر مرتين لبدء الاختبار" : "هذا المستوى مغلق"}
            >
                <Text style={[
                    styles.levelText,
                    { color: isUnlocked ? '#FFFFFF' : currentTheme.textSecondary }
                ]}>
                    مستوى {index + 1}
                </Text>
                {!isUnlocked && (
                    <Text style={[styles.lockedText, { color: currentTheme.wrong }]} accessible={false}>
                        (مغلق)
                    </Text>
                )}
            </TouchableOpacity>
        );
    };

    const levelsArray = Object.keys(topic.levelsData);

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: currentTheme.background }]}>
            <View style={styles.headerContainer} accessible={true} accessibilityRole="header">
                <Text style={[styles.headerTitle, { color: currentTheme.text }]}>
                    {topic.name}
                </Text>
            </View>
            <FlatList
                data={levelsArray}
                keyExtractor={(item) => item}
                renderItem={renderLevel}
                contentContainerStyle={styles.listContainer}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    headerContainer: {
        padding: 20,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    listContainer: {
        padding: 16,
    },
    levelButton: {
        padding: 20,
        borderRadius: 12,
        marginBottom: 16,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    lockedButton: {
        opacity: 0.7,
        borderWidth: 1,
        borderColor: '#CCCCCC',
    },
    levelText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    lockedText: {
        fontSize: 14,
        marginLeft: 8,
        fontWeight: 'bold',
    }
});
