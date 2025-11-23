import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { scale, verticalScale, moderateScale } from '../utils/scaling';
import { supabase } from '../lib/supabase';

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const inputWidth = scale(329);
  const inputHeight = verticalScale(55);
  const containerHeight = moderateScale(568);
  const verticalSpacing = verticalScale(20);

  const handleRegister = async () => {
    if (!email || !username || !password) {
      alert('Please fill out all fields');
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username: username, // store username in metadata
        }
      }
    });

    if (error) {
      console.log('Sign up error:', error.message);
      alert(error.message);
      return;
    }

    console.log('User registered:', data);

    alert('Account has been successfully created!');
    // You can navigate after confirmation or immediately:
    // navigation.navigate('Home')
  };

  return (
    <SafeAreaView
      className="bg-white flex-1 items-center"
      style={{ paddingHorizontal: scale(10) }}
    >
      <Image
        source={require('../assets/Logo2.png')}
        style={{ width: scale(350), height: verticalScale(100), resizeMode: 'contain' }}
      />
      <Text></Text>
      <View
        className="bg-gray-200 justify-center self-stretch rounded-xl"
        style={{ height: containerHeight, paddingVertical: verticalSpacing }}
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
            autoComplete="email"
            placeholder="Enter your email"
          />
        </View>

        <View style={{ width: inputWidth, alignSelf: 'center', marginBottom: verticalSpacing }}>
          <Text className="text-2xl font-bold">Username</Text>
          <TextInput
            className="border border-gray-400 rounded-lg p-3"
            style={{ height: inputHeight }}
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            autoComplete="username"
            placeholder="Choose a username"
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
            autoCapitalize="none"
            autoComplete="password"
            placeholder="Create a password"
          />
        </View>

        <View style={{ width: inputWidth, alignSelf: 'center' }}>
          <TouchableOpacity
            className="bg-gray-300 rounded-lg justify-center items-center"
            style={{ height: verticalScale(60) }}
            onPress={handleRegister}
          >
            <Text className="text-2xl font-bold">Register</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

