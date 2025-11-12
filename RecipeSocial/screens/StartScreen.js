import { View, Text, Button, Alert, TouchableOpacity } from 'react-native'
import React from 'react'

export default function StartScreen() {
  return (
    <View className="flex-1 bg-white items-center justify-center px-6">
      <Text className="text-4xl font-bold text-emerald-600 mb-10">
        RecipeSocial
      </Text>

      <TouchableOpacity
        className="bg-emerald-500 w-full py-3 rounded-2xl mb-4"
        onPress={() => Alert.alert('Simple Button pressed')}
      >
        <Text className="text-white text-center text-lg font-semibold">
          Register
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="border border-emerald-500 w-full py-3 rounded-2xl"
        onPress={() => Alert.alert('Log in pressed')}
      >
        <Text className="text-emerald-600 text-center text-lg font-semibold">
          Log in
        </Text>
      </TouchableOpacity>
    </View>
  )
}
