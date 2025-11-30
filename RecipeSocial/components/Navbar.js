import React from 'react'
import { View, Text, Alert, TouchableOpacity, Image, StyleSheet } from 'react-native'
import { scale, verticalScale, moderateScale } from '../utils/scaling';
import { Ionicons } from '@expo/vector-icons';



export default function Navbar({ navigation }) {
  return (
    <View style={styles.container} >
      <TouchableOpacity style={styles.buttons}><Ionicons style={styles.icons} name="home" size={moderateScale(28)} color="black" /></TouchableOpacity>
      <TouchableOpacity style={styles.buttons}><Ionicons style={styles.icons} name="home" size={moderateScale(28)} color="black" /></TouchableOpacity>
      <TouchableOpacity style={styles.buttons}><Ionicons style={styles.icons} name="home" size={moderateScale(28)} color="black" /></TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
   
    flexDirection: 'row',
    alignSelf: 'center', 
    justifyContent: "flex-end",
    borderRadius: scale(10),
    width: scale(373),
    height: moderateScale(70),
    paddingLeft: scale(20),
    paddingRight: scale(20),
    justifyContent: "space-between",
    backgroundColor: '#7CC57E',
    alignItems: 'center',
    flexShrink: 0,

    position: 'absolute',   // fix to screen
    bottom: verticalScale(10),              // at the bottom
  },
  buttons: {
    width: scale(50),
    height: verticalScale(50),
    backgroundColor: '#fff8e1',
    borderRadius: 50,
    alignItems: "center",      // centers horizontally
    justifyContent: "center",
    elevation: 4, 
    shadowColor: '#000',
  },
});
