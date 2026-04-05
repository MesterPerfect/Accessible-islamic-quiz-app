import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeContext';

export default function TopicsScreen({ route, navigation }) {
    const { category } = route.params;
    const { currentTheme } = useTheme();

    const renderTopic = ({ item }) => (
        <TouchableOpacity
            style={[styles.topicButton, { backgroundColor: currentTheme.primary }]}
            onPress={() => navigation.navigate('Levels', { topic: item, categoryId: category.id })}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel={item.name}
        >
            <Text style={styles.buttonText}>{item.name}</Text>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: currentTheme.background }]}>
            <View style={[styles.headerContainer, { borderBottomColor: currentTheme.surface }]}>
                <Text style={[styles.headerTitle, { color: currentTheme.text }]}>
                    {category.arabicName}
                </Text>
            </View>
            <FlatList
                data={category.topics}
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderTopic}
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
    topicButton: {
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        alignItems: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    }
});
