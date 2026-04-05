import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, Ionicons } from '@expo/vector-icons'; // Added Ionicons
import { useTheme } from '../theme/ThemeContext';
import categories from '../data/questions.json';

export default function HomeScreen({ navigation }) {
    const { currentTheme } = useTheme();

    const renderHeader = () => (
        <View style={styles.header}>
            <Text style={[styles.mainDescription, { color: currentTheme.textSecondary }]}>
                مرحباً بك في تطبيق الأسئلة الإسلامية. اختر تصنيفاً لتبدأ الاختبار وتختبر معلوماتك.
            </Text>

            {/* Prominent Statistics Button */}
            <TouchableOpacity 
                style={[styles.statsCard, { backgroundColor: currentTheme.primary }]}
                onPress={() => navigation.navigate('Statistics')}
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel="عرض الإحصائيات والجوائز الخاصة بي"
            >
                <View style={styles.statsCardContent}>
                    <Ionicons name="stats-chart" size={28} color="#FFFFFF" />
                    <Text style={styles.statsCardText}>إحصائياتي وإنجازاتي</Text>
                </View>
                <Feather name="chevron-left" size={24} color="#FFFFFF" />
            </TouchableOpacity>
        </View>
    );

    const renderCategory = ({ item }) => (
        <TouchableOpacity 
            style={[styles.categoryContainer, { backgroundColor: currentTheme.surface }]}
            onPress={() => navigation.navigate('Topics', { category: item })}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel={`${item.title}. ${item.description}`}
        >
            <Text style={[styles.categoryTitle, { color: currentTheme.primary }]}>{item.title}</Text>
            <Text style={[styles.categoryDescription, { color: currentTheme.textSecondary }]}>
                {item.description}
            </Text>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: currentTheme.background }]}>
            <FlatList
                data={categories}
                keyExtractor={(item) => item.id.toString()}
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
    mainDescription: {
        fontSize: 16,
        textAlign: 'center',
        lineHeight: 24,
        fontFamily: 'Cairo_Regular',
        marginBottom: 20,
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
    categoryTitle: {
        fontSize: 24,
        marginBottom: 8,
        textAlign: 'center',
        fontFamily: 'Cairo_Bold',
    },
    categoryDescription: {
        fontSize: 14,
        textAlign: 'center',
        lineHeight: 22,
        fontFamily: 'Cairo_Regular',
    }
});
