import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, TouchableOpacity, Image, Alert, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import Navbar from '../components/Navbar';
import Header from '../components/Header';
import { scale, verticalScale, moderateScale } from '../utils/scaling';
import { supabase } from '../lib/supabase';

export default function CollectionsScreen({ navigation }) {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const getFavorites = async () => {
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
        setFavorites(data || []);
      }
    } catch (err) {
      console.error('Error:', err);
    }
    setLoading(false);
  };

  useEffect(() => {
    getFavorites();
  }, []);

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
          <View style={styles.gridContainer}>
            {filteredFavorites.map((favorite) => (
              <TouchableOpacity
                key={favorite.recipe_id}
                style={styles.card}
                onPress={() => navigation.navigate('RecipeDetail', { recipeId: favorite.recipe_id })}
              >
                <Image
                  source={require('../assets/testRecipe.jpg')}
                  style={{ width: scale(170), height: scale(170), resizeMode: 'cover', borderRadius: 8 }}
                />
                <Text style={styles.cardText} numberOfLines={2} ellipsizeMode="tail">
                  {favorite.recipes?.title || 'Untitled'}
                </Text>
                <TouchableOpacity
                  style={styles.cardIcon}
                  onPress={(e) => {
                    e.stopPropagation();
                    Alert.alert(
                      'Remove from Collections',
                      `Remove "${favorite.recipes?.title}" from your collections?`,
                      [
                        { text: 'Cancel', style: 'cancel' },
                        {
                          text: 'Remove',
                          style: 'destructive',
                          onPress: () => removeFavorite(favorite.recipe_id)
                        }
                      ]
                    );
                  }}
                >
                  <Ionicons name="heart" size={moderateScale(28)} color="#ff4444" />
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>

      <Navbar navigation={navigation} currentScreen="Collections" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  gridContainer: {
    paddingHorizontal: scale(10),
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: scale(10),
  },
  card: {
    position: 'relative',
    width: scale(170),
    marginBottom: scale(10),
  },
  cardText: {
    position: 'absolute',
    bottom: 10,
    left: 4,
    right: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 5,
    padding: 4,
    color: 'white',
  },
  cardIcon: {
    position: 'absolute',
    top: 5,
    right: 4,
    borderColor: 'black',
    padding: 0,
    color: 'white',
  }
});

