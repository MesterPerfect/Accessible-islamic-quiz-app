import React from 'react';
import { TouchableOpacity, Text } from 'react-native'; // Add these imports
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { SettingsProvider } from './src/context/SettingsContext';
import { ThemeProvider } from './src/theme/ThemeContext';

import HomeScreen from './src/screens/HomeScreen';
import TopicsScreen from './src/screens/TopicsScreen';
import LevelsScreen from './src/screens/LevelsScreen';
import QuizScreen from './src/screens/QuizScreen';
import ResultScreen from './src/screens/ResultScreen';
import SettingsScreen from './src/screens/SettingsScreen'; // Add SettingsScreen

const Stack = createNativeStackNavigator();

export default function App() {
    return (
        <ThemeProvider>
            <SettingsProvider>
            <SafeAreaProvider>
                <NavigationContainer>
                    <Stack.Navigator 
                        initialRouteName="Home"
                        screenOptions={{
                            headerStyle: { backgroundColor: '#121212' }, 
                            headerTintColor: '#FFFFFF',
                            headerTitleAlign: 'center',
                            headerTitleStyle: { fontWeight: 'bold' }
                        }}
                    >
                        <Stack.Screen 
                            name="Home" 
                            component={HomeScreen} 
                            options={({ navigation }) => ({ 
                                title: 'الرئيسية',
                                // Add Settings button to the header
                                headerRight: () => (
                                    <TouchableOpacity 
                                        onPress={() => navigation.navigate('Settings')} 
                                        style={{ marginRight: 15 }}
                                        accessible={true}
                                        accessibilityRole="button"
                                        accessibilityLabel="الإعدادات"
                                    >
                                        <Text style={{ color: '#FFFFFF', fontWeight: 'bold', fontSize: 16 }}>إعدادات</Text>
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
