import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Alert, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { scale, verticalScale, moderateScale } from '../utils/scaling';
import { supabase } from '../lib/supabase';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const inputWidth = scale(329);
  const inputHeight = verticalScale(55);
  const containerHeight = moderateScale(468);
  const verticalSpacing = verticalScale(20);

  // Login function
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      Alert.alert('Login Failed', error.message);
    } else {
      Alert.alert('Success', 'Logged in successfully!');
      // Navigate to home or main screen
      // navigation.navigate('Home');
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { paddingHorizontal: scale(10) }]}>
      <Image
        source={require('../assets/Logo2.png')}
        style={{ width: scale(350), height: verticalScale(100), resizeMode: 'contain' }}
      />

      <View
        style={[
          styles.container,
          {
            height: containerHeight,
            paddingVertical: verticalSpacing,
            marginVertical: verticalSpacing,
          },
        ]}
      >
        <View style={{ width: inputWidth, alignSelf: 'center', marginBottom: verticalSpacing }}>
          <Text className="text-2xl font-bold">Email</Text>
          <TextInput
            className="border border-gray-400 rounded-lg p-3"
            style={{ height: inputHeight }}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholder="Enter your email"
          />
        </View>

        <View style={{ width: inputWidth, alignSelf: 'center', marginBottom: verticalSpacing }}>
          <Text className="text-2xl font-bold">Password</Text>
          <TextInput
            className="border border-gray-400 rounded-lg p-3"
            style={{ height: inputHeight }}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholder="Enter your password"
          />
        </View>

        <View style={{ width: inputWidth, alignSelf: 'center' }}>
          <Text className="self-end mb-4" style={styles.text}>Forgot Password?</Text>
          <TouchableOpacity
            className="bg-gray-300 rounded-lg justify-center items-center"
            style={[styles.button, { height: verticalScale(60) }]}
            onPress={handleLogin}
          >
            <Text className="text-2xl font-bold">Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
  },
  container: {
    backgroundColor: '#7CC57E',
    borderWidth: 1,
    borderColor: '#c0c0c0',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  button: {
    backgroundColor: '#FFFCF1',
  },
  border: {
    borderColor: '#7CC57E',
  },
  text: {
    color: '#d34067',
  }
})