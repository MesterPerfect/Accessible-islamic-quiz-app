import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeContext';

export default function SettingsScreen() {
    const { currentTheme, themeMode, toggleTheme } = useTheme();

    const renderThemeOption = (mode, label) => {
        const isSelected = themeMode === mode;
        return (
            <TouchableOpacity
                style={[
                    styles.optionButton,
                    { backgroundColor: currentTheme.surface },
                    isSelected && { borderColor: currentTheme.primary, borderWidth: 2 }
                ]}
                onPress={() => toggleTheme(mode)}
                accessible={true}
                accessibilityRole="button"
                accessibilityState={{ selected: isSelected }}
                accessibilityLabel={label}
                accessibilityHint={`Change app theme to ${label}`}
            >
                <Text style={[
                    styles.optionText, 
                    { color: isSelected ? currentTheme.primary : currentTheme.text }
                ]}>
                    {label}
                </Text>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: currentTheme.background }]}>
            <Text style={[styles.sectionTitle, { color: currentTheme.text }]} accessible={true} accessibilityRole="header">
                المظهر (Appearance)
            </Text>
            
            {renderThemeOption('light', 'الوضع الفاتح')}
            {renderThemeOption('dark', 'الوضع المظلم')}
            {renderThemeOption('highContrast', 'وضع التباين العالي')}
            
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'right',
    },
    optionButton: {
        padding: 18,
        borderRadius: 12,
        marginBottom: 16,
        alignItems: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    optionText: {
        fontSize: 18,
        fontWeight: 'bold',
    }
});
