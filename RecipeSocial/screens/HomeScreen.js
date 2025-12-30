import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, TextInput, TouchableOpacity, Image, Alert, StyleSheet, } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import Navbar from '../components/Navbar';
import Header from '../components/Header';
import Recipes from '../components/Recipes';
import Category from '../components/Category';
import { scale, verticalScale, moderateScale } from '../utils/scaling';
import { supabase } from '../lib/supabase';


export default function HomeScreen({ navigation }) {
  const [CategoriesAndRecipes, setCategoriesAndRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const getCategoriesAndRecipes = async () => {
    console.log('HomeScreen: Loading categories and recipes... (refreshKey:', refreshKey, ')');
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
      console.log('HomeScreen: Loaded', data?.length || 0, 'categories');
      setCategoriesAndRecipes(data);
    }
    setLoading(false);
  };

  // Load and refresh when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      console.log('HomeScreen: useFocusEffect triggered');
      setRefreshKey(prev => prev + 1);
      getCategoriesAndRecipes();
    }, [])
  );

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(selectedCategory === categoryId ? null : categoryId);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} navigation={navigation} />
      <ScrollView horizontal={true} style={{ maxHeight: verticalScale(50) }}>
        <Category
          CategoriesAndRecipes={CategoriesAndRecipes}
          selectedCategory={selectedCategory}
          onCategorySelect={handleCategorySelect}
        />
      </ScrollView>
      <ScrollView contentContainerStyle={{ paddingBottom: scale(120) }} key={refreshKey}>
        <Recipes
          CategoriesAndRecipes={CategoriesAndRecipes}
          selectedCategory={selectedCategory}
          onCategorySelect={handleCategorySelect}
          loading={loading}
          searchQuery={searchQuery}
          navigation={navigation}
        />
      </ScrollView>
      <Navbar navigation={navigation} currentScreen="Home" />

    </SafeAreaView>
  );
}