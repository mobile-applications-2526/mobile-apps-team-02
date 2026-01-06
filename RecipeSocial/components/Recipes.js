import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, TextInput, TouchableOpacity, Image, Alert, StyleSheet, } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { scale, verticalScale, moderateScale, screenWidth } from '../utils/scaling';
import { loadFavorites, toggleFavorite } from '../services/favorites.service';
import VerticalRecipe from './VerticalRecipe';

const CARD_WIDTH = (screenWidth() - scale(10) * 2 - scale(10)) / 2;
export default function Recipes({ CategoriesAndRecipes = [], loading, searchQuery = '', selectedCategory = null, navigation, onCategorySelect = () => { } }) {
    const [favorites, setFavorites] = useState(new Set());
    // Load user's favorites
    useEffect(() => {
        loadUserFavorites();
    }, []);

    const loadUserFavorites = async () => {
        try {
            const favSet = await loadFavorites();
            setFavorites(favSet);
        } catch (err) {
            console.error('Error loading favorites:', err);
        }
    };

    const handleToggleFavorite = async (recipeId) => {
        try {
            const isFavorite = await toggleFavorite(recipeId);
            const newFavorites = new Set(favorites);
            if (isFavorite) {
                newFavorites.add(recipeId);
            } else {
                newFavorites.delete(recipeId);
            }
            setFavorites(newFavorites);
        } catch (err) {
            console.error('Error toggling favorite:', err);
            if (err.message === 'Not authenticated') {
                Alert.alert('Login Required', 'Please login to save favorites');
            } else {
                Alert.alert('Error', err.message);
            }
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
                        <TouchableOpacity
                            onPress={() => onCategorySelect(Category.id)}
                            style={styles.categoryHeader}
                        >
                            <Text style={styles.categoryTitle}>
                                {Category.name}
                            </Text>
                            <Ionicons
                                name={isSelectedCategory ? "chevron-up" : "chevron-down"}
                                size={moderateScale(20)}
                                color="#000"
                            />
                        </TouchableOpacity>

                        {isSelectedCategory ? (
                            // Vertical list for selected category
                            <VerticalRecipe
                                recipes={Category.recipe_categories}
                                favorites={favorites}
                                onPress={(id) =>
                                    navigation.navigate('RecipeDetail', { recipeId: id })
                                }
                                onToggleFavorite={handleToggleFavorite}
                            />
                        ) : (
                            // Horizontal scroll for non-selected categories
                            <ScrollView horizontal={true} style={{ height: scale(134) }} contentContainerStyle={styles.cardrow}>
                                {Category.recipe_categories.map((recipe_categorie) => {
                                    const isFavorite = favorites.has(recipe_categorie.recipe.id);
                                    return (
                                        <TouchableOpacity
                                            key={recipe_categorie.recipe.id}
                                            style={styles.card}
                                            onPress={() => navigation.navigate('RecipeDetail', { recipeId: recipe_categorie.recipe.id })}
                                            testID="recipe-card"
                                        >
                                            <Image
                                                source={recipe_categorie.recipe.image_url ? { uri: recipe_categorie.recipe.image_url } : require('../assets/testRecipe.jpg')}
                                                style={{ width: scale(126), height: scale(126), resizeMode: 'cover', borderRadius: 8 }}
                                            />
                                            <Text style={styles.cardText} numberOfLines={2} ellipsizeMode="tail">
                                                {recipe_categorie.recipe.title}
                                            </Text>
                                            <TouchableOpacity
                                                style={styles.cardIcon}
                                                onPress={(e) => {
                                                    e.stopPropagation();
                                                    handleToggleFavorite(recipe_categorie.recipe.id);
                                                }}
                                            >
                                                <Ionicons
                                                    name={isFavorite ? "heart" : "heart-outline"}
                                                    size={moderateScale(28)}
                                                    color={isFavorite ? "#ff4444" : "white"}
                                                />
                                            </TouchableOpacity>
                                        </TouchableOpacity>
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
    categoryHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: scale(10),
        paddingTop: scale(10),   // replaces mt-4
        gap: scale(6),
    },
    categoryTitle: {
        fontSize: moderateScale(24),
        fontWeight: 'bold',
    },
    cardrow: {
        paddingHorizontal: scale(10),
        gap: scale(10),
    },
    card: {
        position: 'relative',
        textAlign: 'center',
    },
    cardText: {
        position: 'absolute',
        bottom: verticalScale(10),
        left: scale(4),
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        right: scale(4),
        borderRadius: 5,
        padding: 4,
        color: 'white',
    },
    cardIcon: {
        position: 'absolute',
        top: verticalScale(5),
        right: scale(4),
        borderColor: 'black',
        padding: 0,
        color: 'white',
    }
});