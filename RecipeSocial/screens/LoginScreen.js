import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, Alert, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { scale, verticalScale, moderateScale } from '../utils/scaling';
import { authService } from '../services/auth.service';
import AuthHeader from '../components/AuthHeader';
import FormInput from '../components/FormInput';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const containerHeight = moderateScale(468);
  const verticalSpacing = verticalScale(20);

  // Login function
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    try {
      await authService.signIn(email, password);
      Alert.alert('Success', 'Logged in successfully!');
      navigation.navigate('Home');
    } catch (error) {
      Alert.alert('Login Failed', error.message);
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { paddingHorizontal: scale(10) }]}>
      <AuthHeader/>
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
        <FormInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          placeholder="Enter your email"
          testID="login-email-input"
        />

        <FormInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholder="Enter your password"
          testID="login-password-input"
        />

        <View style={{ width: scale(329), alignSelf: 'center' }}>
          <Text className="self-end mb-4" style={styles.text}>Forgot Password?</Text>
          <TouchableOpacity
            className="bg-gray-300 rounded-lg justify-center items-center"
            style={[styles.button, { height: verticalScale(60) }]}
            onPress={handleLogin}
            testID="login-button"
            nativeID="login-button"
            accessibilityLabel="login-button"
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
    backgroundColor: 'rgba(124, 197, 126, 0.1)',
    borderRadius: scale(10),
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: '#rgba(124, 197, 126)',
  },
  text: {
    color: '#d34067',
  }
})