import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeContext';
import { getProgress } from '../utils/storage';

export default function LevelsScreen({ route, navigation }) {
    const { topic, categoryId } = route.params;
    const { currentTheme } = useTheme(); 
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
                accessibilityLabel={`Level ${index + 1}`}
                accessibilityHint={isUnlocked ? "Double tap to start quiz" : "This level is locked"}
            >
                <Text style={[
                    styles.levelText,
                    { color: isUnlocked ? '#FFFFFF' : currentTheme.textSecondary }
                ]}>
                    {index + 1}
                </Text>
            </TouchableOpacity>
        );
    };

    const levelsArray = Object.keys(topic.levelsData);

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: currentTheme.background }]}>
            <View style={[styles.headerContainer, { borderBottomColor: currentTheme.surface }]} accessible={true} accessibilityRole="header">
                <Text style={[styles.headerTitle, { color: currentTheme.text }]}>
                    {topic.name}
                </Text>
            </View>
            <FlatList
                data={levelsArray}
                keyExtractor={(item) => item}
                renderItem={renderLevel}
                numColumns={3}
                columnWrapperStyle={styles.row}
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
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    listContainer: {
        padding: 16,
    },
    row: {
        flex: 1,
        justifyContent: 'flex-start',
    },
    levelButton: {
        width: '30%',
        aspectRatio: 1, 
        margin: '1.5%',
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    lockedButton: {
        opacity: 0.5,
        borderWidth: 2,
        borderStyle: 'dashed',
    },
    levelText: {
        fontSize: 32,
        fontWeight: 'bold',
    }
});
