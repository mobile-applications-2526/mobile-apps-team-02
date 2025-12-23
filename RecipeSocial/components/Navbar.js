import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { scale, verticalScale, moderateScale } from '../utils/scaling';
import { Ionicons } from '@expo/vector-icons';

export default function Navbar({ navigation, currentScreen = 'Home' }) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.buttons}
        onPress={() => navigation?.navigate('Home')}
      >
        <Ionicons
          name="home"
          size={moderateScale(28)}
          color={currentScreen === 'Home' ? '#7CC57E' : 'black'}
        />
      </TouchableOpacity>

      <TouchableOpacity style={styles.buttons}>
        <Ionicons
          name="add"
          size={moderateScale(28)}
          color="black"
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.buttons}
        onPress={() => navigation?.navigate('Collections')}
      >
        <Ionicons
          name="heart"
          size={moderateScale(28)}
          color={currentScreen === 'Collections' ? '#7CC57E' : 'black'}
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.buttons}
        onPress={() => navigation?.navigate('Profile')}
      >
        <Ionicons
          name="person"
          size={moderateScale(28)}
          color={currentScreen === 'Profile' ? '#7CC57E' : 'black'}
        />
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
