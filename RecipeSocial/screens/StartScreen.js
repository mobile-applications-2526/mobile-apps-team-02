import { View, Text, Button, Alert, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import Navbar from '../components/Navbar'

export default function StartScreen({navigation}) {
  return (
    <View className="flex-1 bg-white items-center justify-center px-6">
       <Image
        source={require('../assets/logo.png')}
        className="w-80 h-80 rounded-2xl"
                resizeMode="contain"
       />

      <Text className="text-4xl font-bold text--600 mb-10">
        RecipeSocial
      </Text>

      <TouchableOpacity
        className="bg-blue-500 w-full py-3 rounded-2xl mb-4"
        onPress={() => navigation.navigate('Register')}
      >
        <Text className="text-white text-center text-lg font-semibold">
          Register
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="border border-blue-500 w-full py-3 rounded-2xl"
        onPress={() => navigation.navigate('Login')}
      >
        <Text className="text-emerald-600 text-center text-lg font-semibold">
          Log in
        </Text>
      </TouchableOpacity>
      <Navbar/>
    </View>
  )
}
