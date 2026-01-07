import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { scale, verticalScale, moderateScale } from '../utils/scaling';
import { authService } from '../services/auth.service';
import AuthHeader from '../components/AuthHeader';
import FormInput from '../components/FormInput';

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const containerHeight = moderateScale(568);
  const verticalSpacing = verticalScale(20);

  const handleRegister = async () => {
    if (!email || !username || !password) {
      alert('Please fill out all fields');
      return;
    }

    try {
      await authService.signUp(email, password, username);
      alert('Account has been successfully created!');
      navigation.navigate('Home');
    } catch (error) {
      console.log('Sign up error:', error.message);
      alert(error.message);
    }
  };

  return (
    <SafeAreaView
      className="bg-white flex-1 items-center"
      style={{ paddingHorizontal: scale(10) }}
    >
      <AuthHeader/>
      <Image
        source={require('../assets/Logo2.png')}
        style={{ width: scale(350), height: verticalScale(100), resizeMode: 'contain' }}
      />
      <Text></Text>
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
          autoComplete="email"
          placeholder="Enter your email"
        />

        <FormInput
          label="Username"
          value={username}
          onChangeText={setUsername}
          autoComplete="username"
          placeholder="Choose a username"
        />

        <FormInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoComplete="password"
          placeholder="Create a password"
        />

        <View style={{ width: scale(329), alignSelf: 'center' }}>
          <TouchableOpacity
            className="rounded-lg justify-center items-center"
            style={[styles.button,{ height: verticalScale(60) }]}
            onPress={handleRegister}
          >
            <Text className="text-2xl font-bold">Register</Text>
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
    backgroundColor: '#7CC57E',
  },
  text: {
    color: '#d34067',
  }
})