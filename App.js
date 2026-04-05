import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import HomeScreen from './src/screens/HomeScreen';
import LevelsScreen from './src/screens/LevelsScreen';

const Stack = createNativeStackNavigator();

export default function App() {
    return (
        <SafeAreaProvider>
            <NavigationContainer>
                <Stack.Navigator 
                    initialRouteName="Home"
                    screenOptions={{
                        headerStyle: { backgroundColor: '#1E88E5' },
                        headerTintColor: '#FFFFFF',
                        headerTitleAlign: 'center',
                        headerTitleStyle: { fontWeight: 'bold' }
                    }}
                >
                    <Stack.Screen 
                        name="Home" 
                        component={HomeScreen} 
                        options={{ title: 'الرئيسية' }} 
                    />
                    <Stack.Screen name="Levels" component={LevelsScreen} options={{ title: 'المستويات' }} />
                </Stack.Navigator>
            </NavigationContainer>
        </SafeAreaProvider>
    );
}
