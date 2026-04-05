import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { useTheme } from '../theme/ThemeContext';

export default function AboutScreen() {
    const { currentTheme } = useTheme();
    const [copied, setCopied] = useState(false);

    const iban = 'SA59 8000 0201 6080 1604 7562';
    const swift = 'RJHISARI';

    const copyIBAN = async () => {
        await Clipboard.setStringAsync(iban.replace(/\s/g, ''));
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const openLink = (url) => {
        Linking.openURL(url);
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: currentTheme.background }]}>
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                
                {/* Hero Section */}
                <View style={styles.heroSection}>
                    <Ionicons name="library" size={80} color={currentTheme.primary} style={styles.logoIcon} />
                    <Text style={[styles.appName, { color: currentTheme.primary }]}>أسئلة إسلامية</Text>
                    <Text style={[styles.appDescription, { color: currentTheme.textSecondary }]}>
                        نافذة تستطيع من خلالها تقويم مستواك في العلوم الشرعية، وتطوير حصيلتك العلمية في مجالات متنوعة.
                    </Text>
                </View>

                {/* Info Cards */}
                <View style={styles.cardsContainer}>
                    <TouchableOpacity 
                        style={[styles.infoCard, { backgroundColor: currentTheme.surface }]}
                        onPress={() => openLink('https://dorar.net')}
                    >
                        <Feather name="globe" size={32} color="#0284c7" />
                        <Text style={[styles.cardTitle, { color: currentTheme.text }]}>المصادر</Text>
                        <Text style={[styles.cardDesc, { color: currentTheme.textSecondary }]}>جميع الأسئلة من موقع الدرر السنية الموثوق</Text>
                        <Text style={[styles.cardLink, { color: currentTheme.primary }]}>dorar.net ↗</Text>
                    </TouchableOpacity>

                    <View style={[styles.infoCard, { backgroundColor: currentTheme.surface }]}>
                        <MaterialCommunityIcons name="shield-check-outline" size={32} color="#9333ea" />
                        <Text style={[styles.cardTitle, { color: currentTheme.text }]}>الهدف</Text>
                        <Text style={[styles.cardDesc, { color: currentTheme.textSecondary }]}>تقوية المسلمين في معرفة دينهم بأسلوب تفاعلي ممتع</Text>
                    </View>
                </View>

                {/* Support Section */}
                <View style={[styles.supportSection, { backgroundColor: currentTheme.surface }]}>
                    <View style={styles.supportHeader}>
                        <MaterialCommunityIcons name="hand-heart" size={32} color={currentTheme.primary} />
                        <Text style={[styles.supportTitle, { color: currentTheme.text }]}>ادعمنا</Text>
                    </View>
                    <Text style={[styles.supportSubtitle, { color: currentTheme.textSecondary }]}>
                        تبرعك يساعدنا في إضافة المزيد من الأسئلة والميزات وإبقاء التطبيق مجاناً للجميع
                    </Text>

                    {/* Bank Card */}
                    <View style={[styles.bankCard, { borderColor: currentTheme.primary }]}>
                        <View style={styles.bankHeader}>
                            <Ionicons name="wallet-outline" size={24} color={currentTheme.primary} />
                            <Text style={[styles.bankName, { color: currentTheme.text }]}>مصرف الراجحي</Text>
                        </View>

                        <View style={styles.ibanContainer}>
                            <Text style={[styles.ibanLabel, { color: currentTheme.textSecondary }]}>رقم الحساب (IBAN)</Text>
                            <View style={styles.ibanRow}>
                                <Text style={[styles.ibanValue, { color: currentTheme.text }]}>{iban}</Text>
                                <TouchableOpacity 
                                    style={[styles.copyBtn, { backgroundColor: copied ? currentTheme.correct : currentTheme.primary }]}
                                    onPress={copyIBAN}
                                >
                                    <Feather name={copied ? "check-circle" : "copy"} size={16} color="#FFF" />
                                    <Text style={styles.copyBtnText}>{copied ? 'تم' : 'نسخ'}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={styles.swiftContainer}>
                            <Text style={[styles.swiftLabel, { color: currentTheme.textSecondary }]}>رمز السويفت: <Text style={{ color: currentTheme.text }}>{swift}</Text></Text>
                            <Text style={[styles.accountName, { color: currentTheme.textSecondary }]}>باسم: <Text style={{ color: currentTheme.text }}>ريان المالكي</Text></Text>
                        </View>
                    </View>
                </View>

                {/* Contact Section */}
                <View style={styles.contactSection}>
                    <Text style={[styles.contactTitle, { color: currentTheme.text }]}>
                        <Feather name="mail" size={20} /> تواصل معنا
                    </Text>
                    <Text style={[styles.contactDesc, { color: currentTheme.textSecondary }]}>لديك اقتراح أو استفسار؟ نحن هنا للاستماع</Text>
                    <TouchableOpacity onPress={() => openLink('mailto:rn0x.me@gmail.com')}>
                        <Text style={[styles.contactEmail, { color: currentTheme.primary }]}>rn0x.me@gmail.com</Text>
                    </TouchableOpacity>
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                    <Text style={[styles.footerText, { color: currentTheme.textSecondary }]}>© 2024 — جميع الحقوق محفوظة</Text>
                    <Text style={[styles.footerVersion, { color: currentTheme.textSecondary }]}>الإصدار 1.0.1</Text>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    scrollContent: { padding: 20 },
    heroSection: { alignItems: 'center', marginBottom: 30, marginTop: 10 },
    logoIcon: { marginBottom: 15 },
    appName: { fontSize: 32, fontFamily: 'Cairo_Bold', marginBottom: 10 },
    appDescription: { fontSize: 16, fontFamily: 'Cairo_Regular', textAlign: 'center', lineHeight: 24, paddingHorizontal: 10 },
    cardsContainer: { flexDirection: 'row-reverse', justifyContent: 'space-between', marginBottom: 30 },
    infoCard: { flex: 1, padding: 20, borderRadius: 16, alignItems: 'center', marginHorizontal: 5, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
    cardTitle: { fontSize: 18, fontFamily: 'Cairo_Bold', marginTop: 10, marginBottom: 5 },
    cardDesc: { fontSize: 13, fontFamily: 'Cairo_Regular', textAlign: 'center', lineHeight: 20 },
    cardLink: { fontSize: 14, fontFamily: 'Cairo_Bold', marginTop: 10 },
    supportSection: { padding: 20, borderRadius: 16, marginBottom: 30, elevation: 2 },
    supportHeader: { flexDirection: 'row-reverse', alignItems: 'center', marginBottom: 10, justifyContent: 'center' },
    supportTitle: { fontSize: 24, fontFamily: 'Cairo_Bold', marginRight: 10 },
    supportSubtitle: { fontSize: 14, fontFamily: 'Cairo_Regular', textAlign: 'center', marginBottom: 20 },
    bankCard: { borderWidth: 1, borderRadius: 12, padding: 16 },
    bankHeader: { flexDirection: 'row-reverse', alignItems: 'center', marginBottom: 15 },
    bankName: { fontSize: 18, fontFamily: 'Cairo_Bold', marginRight: 10 },
    ibanContainer: { marginBottom: 15, backgroundColor: 'rgba(0,0,0,0.05)', padding: 12, borderRadius: 8 },
    ibanLabel: { fontSize: 12, fontFamily: 'Cairo_Regular', textAlign: 'right', marginBottom: 5 },
    ibanRow: { flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center' },
    ibanValue: { fontSize: 16, fontFamily: 'Cairo_Bold', letterSpacing: 1 },
    copyBtn: { flexDirection: 'row-reverse', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6 },
    copyBtnText: { color: '#FFF', fontFamily: 'Cairo_Bold', fontSize: 12, marginRight: 5 },
    swiftContainer: { alignItems: 'flex-end' },
    swiftLabel: { fontSize: 14, fontFamily: 'Cairo_Regular', marginBottom: 5 },
    accountName: { fontSize: 14, fontFamily: 'Cairo_Regular' },
    contactSection: { alignItems: 'center', marginBottom: 40 },
    contactTitle: { fontSize: 20, fontFamily: 'Cairo_Bold', marginBottom: 5 },
    contactDesc: { fontSize: 14, fontFamily: 'Cairo_Regular', marginBottom: 10 },
    contactEmail: { fontSize: 18, fontFamily: 'Cairo_Bold', textDecorationLine: 'underline' },
    footer: { alignItems: 'center', marginBottom: 20 },
    footerText: { fontSize: 14, fontFamily: 'Cairo_Regular' },
    footerVersion: { fontSize: 12, fontFamily: 'Cairo_Regular', marginTop: 5 }
});
