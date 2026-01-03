import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { moderateScale, scale, verticalScale } from "../../utils/scaling";
import IngredientsList from "../IngredientsList";
export default function RecipeContent({ recipe,ingredients, renderStars }) {
    return (
        <View style={styles.titleContainer}>
            <Text style={styles.title}>{recipe.title}</Text>
            <View style={styles.metaContainer}>
                <View style={styles.metaItem}>
                    <Text style={styles.metaLabel}>Difficulty:</Text>
                    {renderStars(recipe.difficulty)}
                </View>
                {recipe.prep_time && (
                    <View style={styles.metaItem}>
                        <Ionicons name="time-outline" size={moderateScale(18)} color="#666" />
                        <Text style={styles.metaText}>{recipe.prep_time} min</Text>
                    </View>
                )}
            </View>
            <IngredientsList ingredients={ingredients} />
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginTop: moderateScale(10) }}>Instructions</Text>
            <Text style={styles.description}>{recipe.description}</Text>

        </View>
    );
}

const styles = StyleSheet.create({
    titleContainer: {
        paddingHorizontal: scale(16),
        paddingTop: verticalScale(16),
        paddingBottom: verticalScale(12),
    },
    title: {
        fontSize: moderateScale(28),
        fontWeight: 'bold',
        color: '#333',
        marginBottom: verticalScale(1),
    },
    metaContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: scale(20),
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: scale(8),
    },
    metaLabel: {
        fontSize: moderateScale(14),
        color: '#666',
        fontWeight: '500',
    },
    metaText: {
        fontSize: moderateScale(14),
        color: '#666',
    },
    description: {
        fontSize: moderateScale(16),
        color: '#666',
        marginBottom: verticalScale(12),
    },
});