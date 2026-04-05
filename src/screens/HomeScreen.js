import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import quizData from '../data/questions.json';
import { useTheme } from '../theme/ThemeContext';

export default function HomeScreen({ navigation }) {
    const { currentTheme } = useTheme();

    const renderCategory = ({ item }) => (
        <TouchableOpacity
            style={[styles.categoryContainer, { backgroundColor: currentTheme.surface }]}
            onPress={() => navigation.navigate('Topics', { category: item })}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel={item.arabicName}
        >
            <Text style={[styles.categoryTitle, { color: currentTheme.primary }]}>
                {item.arabicName}
            </Text>
            <Text style={[styles.categoryDescription, { color: currentTheme.textSecondary }]}>
                {item.description}
            </Text>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: currentTheme.background }]}>
            <View style={styles.header}>
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
    header: {
        padding: 16,
        alignItems: 'center',
    },
    mainDescription: {
        fontSize: 16,
        textAlign: 'center',
        lineHeight: 24,
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
    categoryTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
        textAlign: 'center',
    },
    categoryDescription: {
        fontSize: 14,
        textAlign: 'center',
        lineHeight: 22,
    }
});
