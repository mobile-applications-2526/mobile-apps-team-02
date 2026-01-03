import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, TouchableOpacity, Image, Alert, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import Navbar from '../components/Navbar';
import Header from '../components/Header';
import { scale, verticalScale, moderateScale, screenWidth } from '../utils/scaling';
import { supabase } from '../lib/supabase';
import VerticalRecipe from '../components/VerticalRecipe';

const CARD_WIDTH = (screenWidth() - scale(10) * 2 - scale(10)) / 2;
export default function CollectionsScreen({ navigation }) {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  const getFavorites = async () => {
    console.log('CollectionsScreen: Loading favorites... (refreshKey:', refreshKey, ')');
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        Alert.alert('Error', 'Please login to view your collections');
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('favorites')
        .select(`
          recipe_id,
          recipes (
            id,
            title,
            image_url
          )
        `)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error fetching favorites:', error);
        Alert.alert('Error', error.message);
      } else {
        console.log('CollectionsScreen: Loaded', data?.length || 0, 'favorites');
        setFavorites(data || []);
      }
    } catch (err) {
      console.error('Error:', err);
    }
    setLoading(false);
  };

  // Load and refresh when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      console.log('CollectionsScreen: useFocusEffect triggered');
      setRefreshKey(prev => prev + 1);
      getFavorites();
    }, [])
  );

  const removeFavorite = async (recipeId) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        Alert.alert('Error', 'Please login to manage collections');
        return;
      }

      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('recipe_id', recipeId);

      if (error) {
        Alert.alert('Error', error.message);
      } else {
        // Update local state
        setFavorites(favorites.filter(fav => fav.recipe_id !== recipeId));
        Alert.alert('Success', 'Removed from collections');
      }
    } catch (err) {
      console.error('Error removing favorite:', err);
    }
  };

  const confirmRemoveFavorite = (recipeId, title) => {
    Alert.alert(
      'Remove from Collections',
      `Remove "${title}" from your collections?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => removeFavorite(recipeId),
        },
      ]
    );
  };
  // Filter favorites by search query
  const filteredFavorites = favorites.filter(fav => {
    if (!fav.recipes) return false;
    if (searchQuery === '') return true;
    return fav.recipes.title.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} navigation={navigation} />

      <View style={{ paddingHorizontal: scale(10), paddingTop: verticalScale(5) }}>
        <Text className="text-3xl font-bold">My Collections</Text>
        <Text className="text-gray-500 mt-1">
          {filteredFavorites.length} {filteredFavorites.length === 1 ? 'recipe' : 'recipes'}
        </Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: scale(100), paddingTop: verticalScale(10) }} key={refreshKey}>
        {loading ? (
          <View style={{ padding: scale(20), alignItems: 'center' }}>
            <Text style={{ fontSize: moderateScale(16), color: '#666' }}>Loading...</Text>
          </View>
        ) : filteredFavorites.length === 0 ? (
          <View style={{ padding: scale(20), alignItems: 'center' }}>
            <Ionicons name="heart-outline" size={moderateScale(80)} color="#ccc" />
            <Text style={{ fontSize: moderateScale(18), color: '#666', marginTop: 20 }}>
              {searchQuery ? 'No recipes found' : 'No favorites yet'}
            </Text>
            <Text style={{ fontSize: moderateScale(14), color: '#999', marginTop: 10, textAlign: 'center' }}>
              {searchQuery ? 'Try a different search' : 'Tap the heart icon on recipes to add them here'}
            </Text>
          </View>
        ) : (
          <VerticalRecipe
            recipes={filteredFavorites}
            favorites={new Set(filteredFavorites.map(f => f.recipe_id))}
            onPress={(id) =>
              navigation.navigate('RecipeDetail', { recipeId: id })
            }
            onToggleFavorite={(id, title) =>
              confirmRemoveFavorite(id, title)
            }
          />
        )}
      </ScrollView>

      <Navbar navigation={navigation} currentScreen="Collections" />
    </SafeAreaView>
  );
}


