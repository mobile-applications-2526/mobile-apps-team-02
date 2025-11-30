import React, { useState } from 'react';
import { View, ScrollView, Text, TextInput, TouchableOpacity, Image, Alert, StyleSheet, } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import Navbar from '../components/Navbar';
import Header from '../components/Header';
import Recipes from '../components/Recipes';
import Category from '../components/Category';
import { scale, verticalScale, moderateScale } from '../utils/scaling';
import { withTheme } from 'react-native-elements';

export default function HomeScreen({ navigation }) {

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Header />
      <ScrollView horizontal={true} style={{ maxHeight: verticalScale(50) }}>
        <Category/>
      </ScrollView>
      <ScrollView contentContainerStyle={{ paddingBottom: scale(120) }}>
        <Recipes />
      </ScrollView>
      <Navbar />

    </SafeAreaView>
  );
}