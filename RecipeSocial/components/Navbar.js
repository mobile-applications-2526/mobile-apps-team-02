import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { scale, verticalScale } from '../utils/scaling';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function Navbar() {
  const navigation = useNavigation();
  const route = useRoute();

  const isActive = (name) => route.name === name;

  const btnStyle = (name) => [
    styles.buttons,
    isActive(name) && styles.activeButton,
  ];

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={btnStyle('Home')}
        onPress={() => navigation.navigate('Home')}
        testID="nav-home"
        nativeID="nav-home"
        accessibilityLabel="nav-home"
      >
        <Ionicons name="home" size={verticalScale(28)} color="black" />
      </TouchableOpacity>

      <TouchableOpacity
        style={btnStyle('Create')}
        onPress={() => navigation.navigate('Create')}
        testID="nav-create"
        nativeID="nav-create"
        accessibilityLabel="nav-create"
      >
        <Ionicons name="add-outline" size={verticalScale(28)} color="black" />
      </TouchableOpacity>

      <TouchableOpacity
        style={btnStyle('Collections')}
        onPress={() => navigation.navigate('Collections')}
        testID="nav-collections"
        nativeID="nav-collections"
        accessibilityLabel="nav-collections"
      >
        <Ionicons name="heart-outline" size={verticalScale(28)} color="black" />
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
    height: verticalScale(70),
    paddingHorizontal: scale(20),
    backgroundColor: '#7CC57E',
    alignItems: 'center',
    position: 'absolute',
    bottom: verticalScale(10),
  },
  buttons: {
    width: verticalScale(50),
    height: verticalScale(50),
    backgroundColor: '#fff8e1',
    borderRadius: 70,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
  },
  activeButton: {
    backgroundColor: '#f6db91ff',
    elevation: 6,
  },
});
