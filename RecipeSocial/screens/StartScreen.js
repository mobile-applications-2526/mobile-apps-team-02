import { View, Text, Button, Alert, TouchableOpacity, Image, StyleSheet} from 'react-native'
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
        className="w-full py-3 rounded-2xl mb-4"
        onPress={() => navigation.navigate('Register')} style={styles.button}
      >
        <Text className="text-black text-center text-lg font-semibold">
          Register
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="border w-full py-3 rounded-2xl" style= {styles.border}
        onPress={() => navigation.navigate('Login')}
      >
        <Text className=" text-center text-lg font-semibold" style= {styles.text}>
          Log in
        </Text>
      </TouchableOpacity>
    </View>
  )
}
const styles = StyleSheet.create({
  button: {
    backgroundColor: '#7CC57E',
  },
  border:{
    borderColor: '#7CC57E',
  },
  text:{
    color: '#368EDE',
  }
})