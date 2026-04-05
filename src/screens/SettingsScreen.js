import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';
import { useSettings } from '../context/SettingsContext';

// Added navigation prop
export default function SettingsScreen({ navigation }) {
    const { currentTheme, themeMode, toggleTheme } = useTheme();
    const { soundEnabled, toggleSound, hapticsEnabled, toggleHaptics, reviewEnabled, toggleReview, feedbackEnabled, toggleFeedback } = useSettings();

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
            <ScrollView showsVerticalScrollIndicator={false}>
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
                    />
                </View>

                // Add reviewEnabled and toggleReview to destructuring:
                <View style={[styles.settingRow, { backgroundColor: currentTheme.surface }]}>
                    <Text style={[styles.settingLabel, { color: currentTheme.text }]}>إتاحة مراجعة الأخطاء</Text>
                    <Switch
                        trackColor={{ false: '#767577', true: currentTheme.primary }}
                        thumbColor={'#f4f3f4'}
                        onValueChange={toggleReview}
                        value={reviewEnabled}
                        accessible={true}
                        accessibilityRole="switch"
                        accessibilityState={{ checked: reviewEnabled }}
                        accessibilityLabel="تفعيل أو تعطيل إمكانية مراجعة الأخطاء بعد انتهاء المستوى"
                    />
                </View>

                <View style={[styles.settingRow, { backgroundColor: currentTheme.surface }]}>
                    <Text style={[styles.settingLabel, { color: currentTheme.text }]}>نافذة الإجابة الفورية</Text>
                    <Switch
                        trackColor={{ false: '#767577', true: currentTheme.primary }}
                        thumbColor={'#f4f3f4'}
                        onValueChange={toggleFeedback}
                        value={feedbackEnabled}
                        accessible={true}
                        accessibilityRole="switch"
                        accessibilityLabel="تفعيل أو تعطيل نافذة إظهار نتيجة الإجابة الفورية وتصحيحها"
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
                    />
                </View>

                <View style={[styles.divider, { backgroundColor: currentTheme.surface }]} />

                {/* About Section */}
                <Text style={[styles.sectionTitle, { color: currentTheme.text }]} accessible={true} accessibilityRole="header">
                    حول التطبيق
                </Text>
                <TouchableOpacity 
                    style={[styles.settingRow, { backgroundColor: currentTheme.surface }]}
                    onPress={() => navigation.navigate('About')}
                >
                    <Text style={[styles.settingLabel, { color: currentTheme.text }]}>عن التطبيق والدعم</Text>
                    <Feather name="chevron-left" size={24} color={currentTheme.textSecondary} />
                </TouchableOpacity>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
    },
    sectionTitle: {
        fontSize: 22,
        fontFamily: 'Cairo_Bold',
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
        fontFamily: 'Cairo_Bold',
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
        fontFamily: 'Cairo_Regular',
    }
});
