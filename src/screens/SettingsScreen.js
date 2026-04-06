import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';
import { useSettings } from '../context/SettingsContext';

export default function SettingsScreen({ navigation }) {
    const { currentTheme, themeMode, toggleTheme } = useTheme();
    const { soundEnabled, toggleSound, hapticsEnabled, toggleHaptics, reviewEnabled, toggleReview, feedbackEnabled, toggleFeedback } = useSettings();

    const renderThemeIcon = (mode, IconComponent, iconName, label) => {
        const isSelected = themeMode === mode;
        return (
            <TouchableOpacity
                style={[
                    styles.themeIconButton,
                    { backgroundColor: currentTheme.surface },
                    isSelected && { borderColor: currentTheme.primary, borderWidth: 2 }
                ]}
                onPress={() => toggleTheme(mode)}
                accessible={true}
                accessibilityRole="button"
                accessibilityState={{ selected: isSelected }}
                accessibilityLabel={label}
            >
                <IconComponent 
                    name={iconName} 
                    size={28} 
                    color={isSelected ? currentTheme.primary : currentTheme.textSecondary} 
                />
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: currentTheme.background }]}>
            <ScrollView showsVerticalScrollIndicator={false}>
                
                <Text style={[styles.sectionTitle, { color: currentTheme.text }]} accessible={true} accessibilityRole="header">
                    المظهر
                </Text>
                
                <View style={styles.themeRow}>
                    {renderThemeIcon('light', Feather, 'sun', 'الوضع الفاتح')}
                    {renderThemeIcon('dark', Feather, 'moon', 'الوضع المظلم')}
                    {renderThemeIcon('highContrast', Ionicons, 'contrast', 'وضع التباين العالي')}
                </View>

                <View style={[styles.divider, { backgroundColor: currentTheme.surface }]} />

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
                        accessibilityLabel="تفعيل أو تعطيل المؤثرات الصوتية للتطبيق"
                        accessibilityState={{ checked: soundEnabled }}
                    />
                </View>

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
    themeRow: {
        flexDirection: 'row-reverse',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
        gap: 12,
    },
    themeIconButton: {
        flex: 1,
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
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
