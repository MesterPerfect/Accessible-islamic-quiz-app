import React, { useState, useEffect } from 'react';
import { TouchableOpacity, Text, View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as Font from 'expo-font';
import { useFonts, Cairo_400Regular, Cairo_700Bold } from '@expo-google-fonts/cairo';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { ThemeProvider } from './src/theme/ThemeContext';
import { SettingsProvider } from './src/context/SettingsContext';

import HomeScreen from './src/screens/HomeScreen';
import TopicsScreen from './src/screens/TopicsScreen';
import LevelsScreen from './src/screens/LevelsScreen';
import QuizScreen from './src/screens/QuizScreen';
import ResultScreen from './src/screens/ResultScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import AboutScreen from './src/screens/AboutScreen';
import TutorialScreen from './src/screens/TutorialScreen';
import ReviewScreen from './src/screens/ReviewScreen';
import StatisticsScreen from './src/screens/StatisticsScreen';

const Stack = createNativeStackNavigator();

export default function App() {
    const [isFirstLaunch, setIsFirstLaunch] = useState(null);

    let [fontsLoaded] = useFonts({
        Cairo_Regular: Cairo_400Regular,
        Cairo_Bold: Cairo_700Bold,
    });

    // Check if user has launched the app before
    useEffect(() => {
        const checkFirstLaunch = async () => {
            try {
                const hasSeenTutorial = await AsyncStorage.getItem('@has_seen_tutorial');
                if (hasSeenTutorial === 'true') {
                    setIsFirstLaunch(false);
                } else {
                    setIsFirstLaunch(true);
                }
            } catch (error) {
                setIsFirstLaunch(false);
            }
        };
        checkFirstLaunch();
    }, []);

    // Wait until fonts are loaded and first launch status is determined
    if (!fontsLoaded || isFirstLaunch === null) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#121212' }}>
                <ActivityIndicator size="large" color="#4CAF50" />
            </View>
        );
    }

    return (
        <ThemeProvider>
            <SettingsProvider>
                <SafeAreaProvider>
                    <NavigationContainer>
                        <Stack.Navigator 
                            initialRouteName={isFirstLaunch ? "Tutorial" : "Home"}
                            screenOptions={{
                                headerStyle: { backgroundColor: '#1B5E20' }, 
                                headerTintColor: '#FFFFFF',
                                headerTitleAlign: 'center',
                                headerTitleStyle: { 
                                    fontFamily: 'Cairo_Bold',
                                    fontSize: 22 
                                }
                            }}
                        >
                            <Stack.Screen 
                                name="Home" 
                                component={HomeScreen} 
                                options={({ navigation }) => ({ 
                                    title: 'الرئيسية',
                                    headerRight: () => (
                                        <TouchableOpacity 
                                            onPress={() => navigation.navigate('Settings')} 
                                            style={{ marginRight: 15 }}
                                            accessible={true}
                                            accessibilityRole="button"
                                            accessibilityLabel="الإعدادات"
                                        >
                                            <Text style={{ color: '#FFFFFF', fontFamily: 'Cairo_Bold', fontSize: 16 }}>إعدادات</Text>
                                        </TouchableOpacity>
                                    )
                                })} 
                            />
                            <Stack.Screen name="Topics" component={TopicsScreen} options={{ title: 'المواضيع' }} />
                            <Stack.Screen name="Levels" component={LevelsScreen} options={{ title: 'المستويات' }} />
                            <Stack.Screen name="Quiz" component={QuizScreen} options={{ title: 'الاختبار' }} />
                            <Stack.Screen name="Result" component={ResultScreen} options={{ title: 'النتيجة', headerShown: false }} />
                            <Stack.Screen name="Settings" component={SettingsScreen} options={{ title: 'الإعدادات' }} />
                            <Stack.Screen name="About" component={AboutScreen} options={{ title: 'حول التطبيق' }} />
                            <Stack.Screen name="Tutorial" component={TutorialScreen} options={{ headerShown: false }} />
                            <Stack.Screen name="Review" component={ReviewScreen} options={{ headerShown: false }} />
                            <Stack.Screen name="Statistics" component={StatisticsScreen} options={{ headerShown: false }} />
                        </Stack.Navigator>
                    </NavigationContainer>
                </SafeAreaProvider>
            </SettingsProvider>
        </ThemeProvider>
    );
}
