import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeContext';
import { useSettings } from '../context/SettingsContext';

export default function SettingsScreen() {
    const { currentTheme, themeMode, toggleTheme } = useTheme();
    const { soundEnabled, toggleSound, hapticsEnabled, toggleHaptics } = useSettings();

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
            {/* Appearance Section */}
            <Text style={[styles.sectionTitle, { color: currentTheme.text }]} accessible={true} accessibilityRole="header">
                المظهر
            </Text>
            {renderThemeOption('light', 'الوضع الفاتح')}
            {renderThemeOption('dark', 'الوضع المظلم')}
            {renderThemeOption('highContrast', 'وضع التباين العالي')}

            <View style={[styles.divider, { backgroundColor: currentTheme.surface }]} />

            {/* Game Settings Section */}
            <Text style={[styles.sectionTitle, { color: currentTheme.text }]} accessible={true} accessibilityRole="header">
                إعدادات اللعب
            </Text>
            
            <View style={[styles.settingRow, { backgroundColor: currentTheme.surface }]}>
                <Text style={[styles.settingLabel, { color: currentTheme.text }]}>المؤثرات الصوتية</Text>
                <Switch
                    trackColor={{ false: '#767577', true: currentTheme.primary }}
                    thumbColor={'#f4f3f4'}
                    onValueChange={toggleSound}
                    value={soundEnabled}
                    accessible={true}
                    accessibilityRole="switch"
                    accessibilityState={{ checked: soundEnabled }}
                    accessibilityLabel="تفعيل المؤثرات الصوتية"
                />
            </View>

            <View style={[styles.settingRow, { backgroundColor: currentTheme.surface }]}>
                <Text style={[styles.settingLabel, { color: currentTheme.text }]}>الاهتزاز والتفاعل</Text>
                <Switch
                    trackColor={{ false: '#767577', true: currentTheme.primary }}
                    thumbColor={'#f4f3f4'}
                    onValueChange={toggleHaptics}
                    value={hapticsEnabled}
                    accessible={true}
                    accessibilityRole="switch"
                    accessibilityState={{ checked: hapticsEnabled }}
                    accessibilityLabel="تفعيل الاهتزاز"
                />
            </View>

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
        marginBottom: 15,
        marginTop: 10,
        textAlign: 'right',
    },
    optionButton: {
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
    optionText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    divider: {
        height: 2,
        marginVertical: 20,
        borderRadius: 1,
    },
    settingRow: {
        flexDirection: 'row-reverse',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    settingLabel: {
        fontSize: 18,
        fontWeight: '500',
    }
});
