import React, { useState, useCallback } from 'react';
import {  ScrollView,Alert, } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import Navbar from '../components/Navbar';
import Header from '../components/Header';
import Recipes from '../components/Recipes';
import Category from '../components/Category';
import { scale, verticalScale, moderateScale } from '../utils/scaling';
import { fetchCategoriesWithRecipes } from "../services/categories.service";


export default function HomeScreen({ navigation }) {
  const [CategoriesAndRecipes, setCategoriesAndRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);

  const getCategoriesAndRecipes = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchCategoriesWithRecipes();
      setCategoriesAndRecipes(data);
    } catch (e) {
      Alert.alert("Error", e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load and refresh when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      getCategoriesAndRecipes();
    }, [getCategoriesAndRecipes])
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
      <ScrollView contentContainerStyle={{ paddingBottom: scale(120) }}>
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