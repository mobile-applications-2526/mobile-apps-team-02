import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { scale, verticalScale, moderateScale } from '../utils/scaling';

export default function LoginScreen({ navigation }) {
  const inputWidth = scale(329);
  const inputHeight = verticalScale(55);
  const containerHeight = moderateScale(468);
  const verticalSpacing = verticalScale(20);

  return (
    <SafeAreaView
      className="bg-white flex-1 items-center"
      style={{ paddingHorizontal: scale(10) }}
    >
      <Image
        source={require('../assets/Logo2.png')}
        style= {{width: scale(350), height: verticalScale(100),resizeMode: 'contain'}}

      />
      <Text></Text>
      <View
        className="bg-gray-200 justify-center self-stretch rounded-xl"
        style={{ height: containerHeight, paddingVertical: verticalSpacing }}
      >
        <View style={{ width: inputWidth, alignSelf: 'center', marginBottom: verticalSpacing }}>
          <Text className="text-2xl font-bold">Username</Text>
          <TextInput
            className="border border-gray-400 rounded-lg p-3"
            style={{ height: inputHeight }}
          />
        </View>

        <View style={{ width: inputWidth, alignSelf: 'center', marginBottom: verticalSpacing }}>
          <Text className="text-2xl font-bold ">Password</Text>
          <TextInput
            className="border border-gray-400 rounded-lg p-3"
            style={{ height: inputHeight }}
          />
        </View>

        <View style={{ width: inputWidth, alignSelf: 'center' }}>
          <Text className="self-end mb-4">Forgot Password?</Text>
          <TouchableOpacity
            className="bg-gray-300 rounded-lg justify-center items-center"
            style={{ height: verticalScale(60) }}
          >
            <Text className="text-2xl font-bold">Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
