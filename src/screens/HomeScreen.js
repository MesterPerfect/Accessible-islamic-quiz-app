import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import quizData from '../data/questions.json';
import { themes } from '../theme/colors';
import { useTheme } from '../theme/ThemeContext';

export default function HomeScreen({ navigation }) {
    // Set default theme to dark
    const { currentTheme } = useTheme(); 

    const renderCategory = ({ item }) => (
        <View style={[styles.categoryContainer, { backgroundColor: currentTheme.surface }]}>
            <Text style={[styles.categoryTitle, { color: currentTheme.primary }]} accessible={true}>
                {item.arabicName}
            </Text>
            <Text style={[styles.categoryDescription, { color: currentTheme.text }]} accessible={true}>
                {item.description}
            </Text>
            
            {item.topics.map((topic, index) => (
                <TouchableOpacity
                    key={index}
                    style={[styles.topicButton, { backgroundColor: currentTheme.primary }]}
                    onPress={() => navigation.navigate('Levels', { topic: topic, categoryId: item.id })}
                    accessible={true}
                    accessibilityRole="button"
                    accessibilityLabel={`موضوع: ${topic.name}`}
                    accessibilityHint="انقر مرتين لفتح مستويات هذا الموضوع"
                >
                    <Text style={styles.buttonText}>{topic.name}</Text>
                </TouchableOpacity>
            ))}
        </View>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: currentTheme.background }]}>
            <View accessible={true} accessibilityRole="header">
                <Text style={[styles.mainDescription, { color: currentTheme.text }]}>
                    {quizData.description}
                </Text>
            </View>
            <FlatList
                data={quizData.mainCategories}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderCategory}
                contentContainerStyle={styles.listContainer}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    listContainer: {
        padding: 16,
    },
    mainDescription: {
        fontSize: 16,
        textAlign: 'center',
        margin: 16,
        lineHeight: 24,
    },
    categoryContainer: {
        padding: 16,
        borderRadius: 12,
        marginBottom: 16,
        elevation: 2, 
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    categoryTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 8,
        textAlign: 'right',
    },
    categoryDescription: {
        fontSize: 14,
        marginBottom: 16,
        textAlign: 'right',
        lineHeight: 22,
    },
    topicButton: {
        padding: 14,
        borderRadius: 8,
        marginTop: 8,
        alignItems: 'center',
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    }
});
