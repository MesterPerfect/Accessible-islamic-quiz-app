// App.js

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// TODO: Import screens here later
// import HomeScreen from './src/screens/HomeScreen';
// import QuizScreen from './src/screens/QuizScreen';

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
                    }}
                >
                    {/* Screens will be registered here */}
                    {/* <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Islamic Quiz' }} /> */}
                </Stack.Navigator>
            </NavigationContainer>
        </SafeAreaProvider>
    );
}
