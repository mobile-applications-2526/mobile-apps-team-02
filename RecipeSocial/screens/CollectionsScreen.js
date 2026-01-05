import React, { useState, useCallback  } from 'react';
import { View, ScrollView, Text, TouchableOpacity, Image, Alert, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import Navbar from '../components/Navbar';
import Header from '../components/Header';
import { scale, verticalScale, moderateScale, screenWidth } from '../utils/scaling';
import VerticalRecipe from '../components/VerticalRecipe';
import { fetchFavorites, deleteFavorite } from '../services/favorites.service';

const CARD_WIDTH = (screenWidth() - scale(10) * 2 - scale(10)) / 2;
export default function CollectionsScreen({ navigation }) {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const getFavorites = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchFavorites();
      setFavorites(data);
    } catch (e) {
      console.error('Error fetching favorites:', e);
      Alert.alert("Error", e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      getFavorites();
    }, [getFavorites])
  );


   const removeFavorite = async (recipeId) => {
    try {
      await deleteFavorite(recipeId);
      setFavorites(prev => prev.filter(f => f.recipe_id !== recipeId));
      Alert.alert('Success', 'Removed from collections');
    } catch (e) {
      Alert.alert("Error", e.message);
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

      <ScrollView contentContainerStyle={{ paddingBottom: scale(100), paddingTop: verticalScale(10) }}>
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