import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Import our Theme Provider
import { ThemeProvider } from './src/theme/ThemeContext';

import HomeScreen from './src/screens/HomeScreen';
import LevelsScreen from './src/screens/LevelsScreen';
import QuizScreen from './src/screens/QuizScreen';

const Stack = createNativeStackNavigator();

export default function App() {
    return (
        <ThemeProvider>
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
                        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'الرئيسية' }} />
                        <Stack.Screen name="Levels" component={LevelsScreen} options={{ title: 'المستويات' }} />
                        <Stack.Screen name="Quiz" component={QuizScreen} options={{ title: 'الاختبار' }} />
                    </Stack.Navigator>
                </NavigationContainer>
            </SafeAreaProvider>
        </ThemeProvider>
    );
}
