import React from "react";
import { View, Image, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { moderateScale, scale, verticalScale } from "../../utils/scaling";
export default function RecipeHeader({ navigation, recipe,
    currentUser,
    isFavorite,
    onDelete,
    onToggleFavorite, }) {
    return (
        <View style={styles.imageContainer}>
            <Image
                source={recipe.image_url ? { uri: recipe.image_url } : require('../../assets/testRecipe.jpg')}
                style={styles.recipeImage}
            />

            {/* Header on top of image */}
            <View style={styles.headerOverlay}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backIcon}>
                    <Ionicons name="arrow-back" size={moderateScale(28)} color="#fff" />
                </TouchableOpacity>

                <View style={styles.headerRightIcons}>
                    {currentUser && recipe.user_id === currentUser.id && (
                        <TouchableOpacity onPress={onDelete} style={styles.deleteIcon}>
                            <Ionicons name="trash-outline" size={moderateScale(28)} color="#fff" />
                        </TouchableOpacity>
                    )}
                    <TouchableOpacity onPress={onToggleFavorite} style={styles.favoriteIcon}>
                        <Ionicons
                            name={isFavorite ? "heart" : "heart-outline"}
                            size={moderateScale(28)}
                            color={isFavorite ? "#ff4444" : "#fff"}
                        />
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.authorContainer}>
                <TouchableOpacity
                    onPress={() => navigation.navigate('Profile', { userId: recipe.user?.id })}
                    activeOpacity={0.7}
                >
                    <Image
                        source={
                            recipe.user?.avatar_url
                                ? { uri: recipe.user.avatar_url }
                                : require('../../assets/pfp.jpg')
                        }
                        style={styles.authorAvatar}
                    />
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => navigation.navigate('Profile', { userId: recipe.user?.id })}
                    activeOpacity={0.7}
                >
                    <Text style={styles.authorName}>
                        {recipe.user?.username}
                    </Text>
                </TouchableOpacity>
            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    imageContainer: {
        width: '100%',
        height: verticalScale(330),
        overflow: 'hidden', // 👈 IMPORTANT
    },

    recipeImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    headerOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: scale(16),
        paddingTop: verticalScale(12), // SafeAreaView already handles status bar
    },
    headerRightIcons: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    deleteIcon: {
        padding: scale(8),
        marginRight: scale(4),
    },
    authorContainer: {
        position: 'absolute',
        bottom: moderateScale(25),
        left: scale(16),
        flexDirection: 'row',
        alignItems: 'center',
        gap: scale(10),
        zIndex: 10,
    },
    authorAvatar: {
        width: scale(55),
        height: scale(55),
        borderRadius: scale(64),
        borderWidth: 1,
        borderColor: '#fff',
    },

    authorName: {
        color: '#fff',
        fontSize: moderateScale(16),
        fontWeight: '600',
        textShadowColor: 'rgba(0,0,0,0.6)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },
});