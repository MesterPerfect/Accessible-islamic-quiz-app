import React, { useState, useEffect } from 'react';
import { TouchableOpacity, Text, View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as Font from 'expo-font';
import { useFonts, Cairo_400Regular, Cairo_700Bold } from '@expo-google-fonts/cairo';

import { ThemeProvider } from './src/theme/ThemeContext';
import { SettingsProvider } from './src/context/SettingsContext';

import HomeScreen from './src/screens/HomeScreen';
import TopicsScreen from './src/screens/TopicsScreen';
import LevelsScreen from './src/screens/LevelsScreen';
import QuizScreen from './src/screens/QuizScreen';
import ResultScreen from './src/screens/ResultScreen';
import SettingsScreen from './src/screens/SettingsScreen';

const Stack = createNativeStackNavigator();

export default function App() {
    let [fontsLoaded] = useFonts({
        Cairo_Regular: Cairo_400Regular,
        Cairo_Bold: Cairo_700Bold,
    });

    if (!fontsLoaded) {
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
                            initialRouteName="Home"
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
                        </Stack.Navigator>
                    </NavigationContainer>
                </SafeAreaProvider>
            </SettingsProvider>
        </ThemeProvider>
    );
}
