import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, Image, Share } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, FontAwesome, FontAwesome6 } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';

export default function AboutScreen() {
    const { currentTheme } = useTheme();
    const githubLink = 'https://github.com/MesterPerfect/islamic-quiz-app';

    const openLink = (url) => {
        Linking.openURL(url).catch(err => console.error("Couldn't load page", err));
    };

    const shareProject = async () => {
        try {
            await Share.share({
                message: `تطبيق "أسئلة إسلامية" مجاني ومفتوح المصدر! 🌙\nاختبر معلوماتك الشرعية الآن.\nيمكنك دعم المشروع وتصفح الكود عبر جيت هاب من هنا:\n${githubLink}`,
            });
        } catch (error) {
            console.log(error.message);
        }
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: currentTheme.background }]}>
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                
                {/* App Info Section */}
                <View style={styles.heroSection} accessible={true}>
                    <Text style={[styles.appName, { color: currentTheme.primary }]}>أسئلة إسلامية</Text>
                    <Text style={[styles.appVersion, { color: currentTheme.textSecondary }]}>الإصدار 1.0.1</Text>
                    <Text style={[styles.appDescription, { color: currentTheme.text }]}>
                        نافذة تستطيع من خلالها تقويم مستواك في العلوم الشرعية، وتطوير حصيلتك العلمية في مجالات متنوعة بأسلوب تفاعلي ممتع ومتاح للجميع.
                    </Text>
                </View>

                {/* Developer Profile Section */}
                <View style={[styles.profileSection, { backgroundColor: currentTheme.surface }]}>
                    <Image 
                        source={require('../../assets/profile.png')} 
                        style={styles.profileImage} 
                        accessible={true} 
                        accessibilityLabel="صورة المطور أحمد بكر"
                    />
                    <Text style={[styles.devName, { color: currentTheme.text }]} accessible={true}>
                        أحمد بكر (MesterPerfect)
                    </Text>
                    <Text style={[styles.devBio, { color: currentTheme.textSecondary }]} accessible={true}>
                        مطور برمجيات مهتم بصناعة تطبيقات مفيدة وسهلة الوصول.
                    </Text>

                    {/* Social Links */}
                    <View style={styles.socialRow}>
                        <TouchableOpacity 
                            style={styles.socialIcon} 
                            onPress={() => openLink('https://facebook.com/ahmedbakr593')}
                            accessible={true}
                            accessibilityRole="link"
                            accessibilityLabel="تواصل معي عبر فيسبوك"
                        >
                            <FontAwesome name="facebook-square" size={36} color="#1877F2" />
                        </TouchableOpacity>
                        
                        <TouchableOpacity 
                            style={styles.socialIcon} 
                            onPress={() => openLink('https://x.com/ahmedbakr593')}
                            accessible={true}
                            accessibilityRole="link"
                            accessibilityLabel="تواصل معي عبر منصة إكس"
                        >
                            <FontAwesome6 name="x-twitter" size={36} color={currentTheme.text} />
                        </TouchableOpacity>

                        <TouchableOpacity 
                            style={styles.socialIcon} 
                            onPress={() => openLink('https://t.me/ahmedbakr593')}
                            accessible={true}
                            accessibilityRole="link"
                            accessibilityLabel="تواصل معي عبر تيليجرام"
                        >
                            <FontAwesome name="telegram" size={36} color="#0088cc" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Sources Card */}
                <TouchableOpacity 
                    style={[styles.infoCard, { backgroundColor: currentTheme.surface }]}
                    onPress={() => openLink('https://dorar.net')}
                    accessible={true}
                    accessibilityRole="link"
                    accessibilityLabel="المصادر. جميع الأسئلة من موقع الدرر السنية الموثوق. اضغط لزيارة الموقع."
                >
                    <Feather name="globe" size={32} color="#0284c7" />
                    <View style={styles.cardTextContainer}>
                        <Text style={[styles.cardTitle, { color: currentTheme.text }]}>المصادر</Text>
                        <Text style={[styles.cardDesc, { color: currentTheme.textSecondary }]}>جميع الأسئلة من موقع الدرر السنية الموثوق</Text>
                    </View>
                    <Feather name="external-link" size={24} color={currentTheme.textSecondary} />
                </TouchableOpacity>

                {/* Support GitHub Section */}
                <View style={[styles.supportSection, { backgroundColor: currentTheme.surface, borderColor: currentTheme.primary, borderWidth: 1 }]} accessible={false}>
                    <View style={styles.supportHeader}>
                        <FontAwesome name="github" size={32} color={currentTheme.text} />
                        <Text style={[styles.supportTitle, { color: currentTheme.text }]}>ادعم المشروع</Text>
                    </View>
                    <Text style={[styles.supportSubtitle, { color: currentTheme.textSecondary }]}>
                        هذا التطبيق مجاني ومفتوح المصدر. يمكنك دعمنا بإعطاء المشروع نجمة (Star) على جيت هاب، أو مشاركته مع من تحب ليتحقق النفع للجميع.
                    </Text>

                    <View style={styles.githubActions}>
                        <TouchableOpacity 
                            style={[styles.actionBtn, { backgroundColor: currentTheme.primary }]} 
                            onPress={() => openLink(githubLink)}
                            accessible={true}
                            accessibilityRole="button"
                            accessibilityLabel="تقييم المشروع وإعطائه نجمة على موقع جيت هاب"
                        >
                            <FontAwesome name="star" size={20} color="#FFD700" />
                            <Text style={styles.actionBtnText}>أضف نجمة للمشروع</Text>
                        </TouchableOpacity>

                        <TouchableOpacity 
                            style={[styles.actionBtn, { backgroundColor: currentTheme.secondary }]} 
                            onPress={shareProject}
                            accessible={true}
                            accessibilityRole="button"
                            accessibilityLabel="مشاركة رابط المشروع مع الأصدقاء"
                        >
                            <Feather name="share-2" size={20} color="#000" />
                            <Text style={[styles.actionBtnText, { color: '#000' }]}>شارك المشروع</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Footer */}
                <View style={styles.footer} accessible={true}>
                    <Text style={[styles.footerText, { color: currentTheme.textSecondary }]}>© 2024 — جميع الحقوق محفوظة</Text>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    scrollContent: { padding: 20 },
    heroSection: { alignItems: 'center', marginBottom: 25, marginTop: 10 },
    appName: { fontSize: 32, fontFamily: 'Cairo_Bold', marginBottom: 5 },
    appVersion: { fontSize: 14, fontFamily: 'Cairo_Regular', marginBottom: 15 },
    appDescription: { fontSize: 16, fontFamily: 'Cairo_Regular', textAlign: 'center', lineHeight: 26, paddingHorizontal: 10 },
    
    profileSection: { alignItems: 'center', padding: 25, borderRadius: 20, marginBottom: 25, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
    profileImage: { width: 100, height: 100, borderRadius: 50, marginBottom: 15, borderWidth: 3, borderColor: '#1B5E20' },
    devName: { fontSize: 22, fontFamily: 'Cairo_Bold', marginBottom: 5 },
    devBio: { fontSize: 14, fontFamily: 'Cairo_Regular', textAlign: 'center', lineHeight: 22, marginBottom: 20, paddingHorizontal: 10 },
    socialRow: { flexDirection: 'row-reverse', justifyContent: 'center', alignItems: 'center', width: '100%', gap: 30 },
    socialIcon: { padding: 5 },

    infoCard: { flexDirection: 'row-reverse', alignItems: 'center', padding: 20, borderRadius: 16, marginBottom: 25, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
    cardTextContainer: { flex: 1, marginRight: 15, alignItems: 'flex-end' },
    cardTitle: { fontSize: 18, fontFamily: 'Cairo_Bold', marginBottom: 5 },
    cardDesc: { fontSize: 14, fontFamily: 'Cairo_Regular', textAlign: 'right', lineHeight: 22 },
    
    supportSection: { padding: 25, borderRadius: 16, marginBottom: 30, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
    supportHeader: { flexDirection: 'row-reverse', alignItems: 'center', marginBottom: 15, justifyContent: 'center' },
    supportTitle: { fontSize: 22, fontFamily: 'Cairo_Bold', marginRight: 15 },
    supportSubtitle: { fontSize: 15, fontFamily: 'Cairo_Regular', textAlign: 'center', lineHeight: 24, marginBottom: 25 },
    githubActions: { width: '100%', gap: 15 },
    actionBtn: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'center', paddingVertical: 14, borderRadius: 12, elevation: 2 },
    actionBtnText: { color: '#FFFFFF', fontSize: 18, fontFamily: 'Cairo_Bold', marginRight: 10 },
    
    footer: { alignItems: 'center', marginBottom: 20 },
    footerText: { fontSize: 14, fontFamily: 'Cairo_Regular' }
});