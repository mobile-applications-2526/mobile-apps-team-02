import "./global.css";
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import StartScreen from './screens/StartScreen';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Start" screenOptions={{ headerShown: true }}>
          <Stack.Screen name="Start" component={StartScreen} />
          {/* <Stack.Screen name="Login" component={LoginScreen} /> */}
          {/* <Stack.Screen name="Register" component={RegisterScreen} /> */}
        </Stack.Navigator>
      </NavigationContainer>
   );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
