import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, TextInput, TouchableOpacity, Image, Alert, StyleSheet, } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import Navbar from '../components/Navbar';
import Header from '../components/Header';
import Recipes from '../components/Recipes';
import Category from '../components/Category';
import { scale, verticalScale, moderateScale } from '../utils/scaling';
import { supabase } from '../lib/supabase';


export default function HomeScreen({ navigation }) {
  const [CategoriesAndRecipes, setCategoriesAndRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  const getCategoriesAndRecipes = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('categories')
      .select(`id, name, recipe_categories (
        recipe:recipes (
          id,
          title,
          image_url
        )
      )`);

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      setCategoriesAndRecipes(data);
    }
    setLoading(false);
  };
  useEffect(() => {
    getCategoriesAndRecipes();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Header />
      <ScrollView horizontal={true} style={{ maxHeight: verticalScale(50) }}>
        <Category CategoriesAndRecipes={CategoriesAndRecipes} />
      </ScrollView>
      <ScrollView contentContainerStyle={{ paddingBottom: scale(120) }}>
        <Recipes CategoriesAndRecipes={CategoriesAndRecipes} loading={loading} />
      </ScrollView>
      <Navbar />

    </SafeAreaView>
  );
}