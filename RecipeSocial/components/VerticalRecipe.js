import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { scale, verticalScale, moderateScale, screenWidth } from '../utils/scaling';

const H_PADDING = scale(10);
const GAP = scale(10);
const CARD_WIDTH = (screenWidth() - H_PADDING * 2 - GAP) / 2;

export default function VerticalRecipe({
    recipes,
    favorites = new Set(),
    onPress,
    onToggleFavorite,
}) {
    return (
        <View style={styles.container}>
            {recipes.map((item) => {
                const recipe = item.recipe ?? item.recipes;
                const recipeId = recipe.id;
                const isFavorite = favorites.has?.(recipeId);
                return (
                    <TouchableOpacity
                        key={recipeId}
                        style={styles.card}
                        onPress={() => onPress(recipeId)}
                    >
                        <Image
                            source={
                                recipe.image_url
                                    ? { uri: recipe.image_url }
                                    : require('../assets/testRecipe.jpg')
                            }
                            style={styles.image}
                        />

                        <Text style={styles.cardText} numberOfLines={2}>
                            {recipe.title}
                        </Text>

                        {onToggleFavorite && (
                            <TouchableOpacity
                                style={styles.cardIcon}
                                onPress={(e) => {
                                    e.stopPropagation();
                                    onToggleFavorite(recipeId, recipe.title);
                                }}
                            >
                                <Ionicons
                                    name={isFavorite ? 'heart' : 'heart-outline'}
                                    size={moderateScale(28)}
                                    color={isFavorite ? '#ff4444' : 'white'}
                                />
                            </TouchableOpacity>
                        )}
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: H_PADDING,
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: GAP,
        paddingVertical: scale(10),
    },
    card: {
        width: CARD_WIDTH,
        position: 'relative',
        marginBottom: scale(10),
    },
    image: {
        width: '100%',
        height: CARD_WIDTH,
        borderRadius: 8,
        resizeMode: 'cover',
    },
    cardText: {
        position: 'absolute',
        bottom: verticalScale(10),
        left: scale(4),
        right: scale(4),
        backgroundColor: 'rgba(0,0,0,0.6)',
        borderRadius: 5,
        padding: 4,
        color: 'white',
    },
    cardIcon: {
        position: 'absolute',
        top: verticalScale(5),
        right: scale(4),
    },
});
