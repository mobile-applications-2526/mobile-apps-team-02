import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, TextInput, TouchableOpacity, Image, Alert, StyleSheet, } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { scale, verticalScale, moderateScale } from '../utils/scaling';
import { supabase } from '../lib/supabase';


export default function Recipes({ CategoriesAndRecipes = [], loading, searchQuery = '', selectedCategory = null }) {
    const [favorites, setFavorites] = useState(new Set());

    // Load user's favorites
    useEffect(() => {
        loadFavorites();
    }, []);

    const loadFavorites = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data, error } = await supabase
                .from('favorites')
                .select('recipe_id')
                .eq('user_id', user.id);

            if (!error && data) {
                setFavorites(new Set(data.map(fav => fav.recipe_id)));
            }
        } catch (err) {
            console.error('Error loading favorites:', err);
        }
    };

    const toggleFavorite = async (recipeId) => {
        try {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                Alert.alert('Login Required', 'Please login to save favorites');
                return;
            }

            const isFavorite = favorites.has(recipeId);

            if (isFavorite) {
                // Remove from favorites
                const { error } = await supabase
                    .from('favorites')
                    .delete()
                    .eq('user_id', user.id)
                    .eq('recipe_id', recipeId);

                if (error) {
                    Alert.alert('Error', error.message);
                } else {
                    const newFavorites = new Set(favorites);
                    newFavorites.delete(recipeId);
                    setFavorites(newFavorites);
                }
            } else {
                // Add to favorites
                const { error } = await supabase
                    .from('favorites')
                    .insert({ user_id: user.id, recipe_id: recipeId });

                if (error) {
                    Alert.alert('Error', error.message);
                } else {
                    const newFavorites = new Set(favorites);
                    newFavorites.add(recipeId);
                    setFavorites(newFavorites);
                }
            }
        } catch (err) {
            console.error('Error toggling favorite:', err);
        }
    };

    // Filter categories and recipes based on search query and selected category
    const filteredData = CategoriesAndRecipes.map((category) => {
        // Filter recipes by search query
        const filteredRecipes = category.recipe_categories.filter((recipe_category) => {
            const recipe = recipe_category.recipe;
            const matchesSearch = searchQuery === '' ||
                recipe.title.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesSearch;
        });

        return {
            ...category,
            recipe_categories: filteredRecipes
        };
    }).filter((category) => {
        // Only show categories that have recipes after filtering
        // Or if a specific category is selected, only show that one
        if (selectedCategory !== null) {
            return category.id === selectedCategory && category.recipe_categories.length > 0;
        }
        return category.recipe_categories.length > 0;
    });

    return (
        <View>
            {filteredData.map((Category) => {
                const isSelectedCategory = selectedCategory === Category.id;

                return (
                    <View key={Category.id}>
                        <Text style={{ paddingHorizontal: scale(10) }} className="text-2xl font-bold mt-4">
                            {Category.name}
                        </Text>

                        {isSelectedCategory ? (
                            // Vertical list for selected category
                            <View style={styles.verticalContainer}>
                                {Category.recipe_categories.map((recipe_categorie) => {
                                    const isFavorite = favorites.has(recipe_categorie.recipe.id);
                                    return (
                                        <View key={recipe_categorie.recipe.id} style={styles.verticalCard}>
                                            <Image
                                                source={require('../assets/testRecipe.jpg')}
                                                style={{ width: scale(126), height: scale(126), resizeMode: 'fit' }}
                                            />
                                            <Text style={styles.cardText} numberOfLines={2} ellipsizeMode="tail">
                                                {recipe_categorie.recipe.title}
                                            </Text>
                                            <TouchableOpacity
                                                style={styles.cardIcon}
                                                onPress={() => toggleFavorite(recipe_categorie.recipe.id)}
                                            >
                                                <Ionicons
                                                    name={isFavorite ? "heart" : "heart-outline"}
                                                    size={moderateScale(28)}
                                                    color={isFavorite ? "#ff4444" : "white"}
                                                />
                                            </TouchableOpacity>
                                        </View>
                                    );
                                })}
                            </View>
                        ) : (
                            // Horizontal scroll for non-selected categories
                            <ScrollView horizontal={true} style={{ height: scale(134) }} contentContainerStyle={styles.cardrow}>
                                {Category.recipe_categories.map((recipe_categorie) => {
                                    const isFavorite = favorites.has(recipe_categorie.recipe.id);
                                    return (
                                        <View key={recipe_categorie.recipe.id} style={styles.card}>
                                            <Image
                                                source={require('../assets/testRecipe.jpg')}
                                                style={{ width: scale(126), height: scale(126), resizeMode: 'fit' }}
                                            />
                                            <Text style={styles.cardText} numberOfLines={2} ellipsizeMode="tail">
                                                {recipe_categorie.recipe.title}
                                            </Text>
                                            <TouchableOpacity
                                                style={styles.cardIcon}
                                                onPress={() => toggleFavorite(recipe_categorie.recipe.id)}
                                            >
                                                <Ionicons
                                                    name={isFavorite ? "heart" : "heart-outline"}
                                                    size={moderateScale(28)}
                                                    color={isFavorite ? "#ff4444" : "white"}
                                                />
                                            </TouchableOpacity>
                                        </View>
                                    );
                                })}
                            </ScrollView>
                        )}
                    </View>
                );
            })}
            {filteredData.length === 0 && !loading && (
                <View style={{ padding: scale(20), alignItems: 'center' }}>
                    <Text style={{ fontSize: moderateScale(16), color: '#666' }}>
                        No recipes found
                    </Text>
                </View>
            )}
        </View>
    )
}
const styles = StyleSheet.create({
    cardrow: {
        paddingHorizontal: scale(10),
        gap: scale(10),
    },
    verticalContainer: {
        paddingHorizontal: scale(10),
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: scale(10),
        paddingVertical: scale(10),
    },
    card: {
        position: 'relative',
        textAlign: 'center',
    },
    verticalCard: {
        position: 'relative',
        textAlign: 'center',
        width: scale(126),
        marginBottom: scale(10),
    },
    cardText: {
        position: 'absolute',
        bottom: 10,
        left: 4,
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