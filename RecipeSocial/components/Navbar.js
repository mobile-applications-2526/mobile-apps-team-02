import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { scale, verticalScale, moderateScale } from '../utils/scaling';
import { Ionicons } from '@expo/vector-icons';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/native';

export default function Navbar() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>

      <TouchableOpacity
        style={styles.buttons}
        onPress={() => navigation.navigate('Home')}
      >
        <Ionicons name="home" size={moderateScale(28)} color="black" />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.buttons}
        onPress={() => navigation.navigate('Home')}
      >
        <Ionicons name="restaurant" size={moderateScale(28)} color="black" />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.buttons}
        onPress={() => navigation.navigate('Profile')}
      >
        <AntDesign name="profile" size={moderateScale(28)} color="black" />
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignSelf: 'center',
    justifyContent: 'space-between',
    borderRadius: scale(10),
    width: scale(373),
    height: moderateScale(70),
    paddingHorizontal: scale(20),
    backgroundColor: '#7CC57E',
    alignItems: 'center',

    position: 'absolute',
    bottom: verticalScale(10),
  },
  buttons: {
    width: scale(50),
    height: verticalScale(50),
    backgroundColor: '#fff8e1',
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
  },
});
