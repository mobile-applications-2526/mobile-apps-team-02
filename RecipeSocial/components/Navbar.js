import React from 'react'
import { View, Text, Alert, TouchableOpacity, Image } from 'react-native'
import { Ionicons } from '@expo/vector-icons';



export default function Navbar({navigation}) {
  return(
    <View>
        <TouchableOpacity><Ionicons name= "home" size={24} color="black"/></TouchableOpacity>
        <TouchableOpacity><Ionicons name= "home" size={24} color="black"/></TouchableOpacity>
        <TouchableOpacity><Ionicons name= "home" size={24} color="black"/></TouchableOpacity>
    </View>
  )
}
