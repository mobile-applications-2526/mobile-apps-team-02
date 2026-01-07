import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { scale, verticalScale, moderateScale } from '../utils/scaling';
import RecipeHeader from '../components/DetailScreen/RecipeHeader';
import  RecipeTab from '../components/DetailScreen/RecipeTab';
import RecipeContent from '../components/DetailScreen/RecipeContent';
import CommentContent from '../components/DetailScreen/CommentContent';
import { commentsService } from '../services/comments.service';
import { checkIfFavorite, toggleFavorite } from '../services/favorites.service';
import { deleteRecipe, getRecipeDetails, getRecipeIngredients } from '../services/recipes.service';
import { authService } from '../services/auth.service';

export default function RecipeDetailScreen({ route, navigation }) {
  const { recipeId } = route.params;
  const [recipe, setRecipe] = useState(null);
  const [ingredients, setIngredients] = useState([]);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState('recipe'); // 'recipe' or 'comments'

  useEffect(() => {
    loadRecipeDetails();
    loadComments();
    checkFavoriteStatus();
    getCurrentUser();
  }, [recipeId]);

  // Refresh favorite status when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      checkFavoriteStatus();
    }, [recipeId])
  );

  const getCurrentUser = async () => {
    const user = await authService.getCurrentUser();
    setCurrentUser(user);
  };

  const loadRecipeDetails = async () => {
    try {
      setLoading(true);

      // Fetch recipe details
      const recipeData = await getRecipeDetails(recipeId);
      setRecipe(recipeData);

      // Fetch ingredients
      const ingredientsData = await getRecipeIngredients(recipeId);
      setIngredients(ingredientsData);
    } catch (error) {
      console.error('Error loading recipe:', error);
      Alert.alert('Error', 'Failed to load recipe details');
    } finally {
      setLoading(false);
    }
  };

  const loadComments = async () => {
    try {
      setCommentsLoading(true);
      console.log('Loading comments for recipe:', recipeId);

      const commentsData = await commentsService.getComments(recipeId);
      console.log('Comments fetched:', commentsData?.length || 0, 'comments');
      setComments(commentsData || []);
    } catch (error) {
      console.error('Error loading comments:', error);
      setComments([]);
    } finally {
      setCommentsLoading(false);
    }
  };

  const checkFavoriteStatus = async () => {
    try {
      const isFav = await checkIfFavorite(recipeId);
      setIsFavorite(isFav);
    } catch (error) {
      console.error('Error checking favorite:', error);
      setIsFavorite(false);
    }
  };

  const handleToggleFavorite = async () => {
    const wasInFavorites = isFavorite;

    if (wasInFavorites) {
      // Show confirmation before removing
      Alert.alert(
        'Remove from Collections',
        `Remove "${recipe?.title}" from your collections?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Remove',
            style: 'destructive',
            onPress: async () => {
              try {
                const isFav = await toggleFavorite(recipeId);
                setIsFavorite(isFav);
                Alert.alert('Success', 'Removed from collections');
              } catch (error) {
                console.error('Error removing favorite:', error);
                Alert.alert('Error', 'Failed to update favorite');
              }
            },
          },
        ]
      );
    } else {
      // Add to favorites without confirmation
      try {
        const isFav = await toggleFavorite(recipeId);
        setIsFavorite(isFav);
        Alert.alert('Success', 'Added to collections');
      } catch (error) {
        console.error('Error adding favorite:', error);
        if (error.message === 'Not authenticated') {
          Alert.alert('Login Required', 'Please login to save favorites');
        } else {
          Alert.alert('Error', 'Failed to update favorite');
        }
      }
    }
  };

  const handleDeleteRecipe = async () => {
    Alert.alert(
      'Delete Recipe',
      'Are you sure you want to delete this recipe? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const user = await authService.getCurrentUser();

              if (!user) {
                Alert.alert('Error', 'You must be logged in to delete recipes');
                return;
              }

              console.log('Attempting to delete recipe:', recipeId, 'by user:', user.id);

              await deleteRecipe(recipeId, user.id);

              console.log('Recipe deleted successfully');

              // Navigate back immediately without alert for better UX
              navigation.goBack();

              // Show success toast/alert after navigation
              setTimeout(() => {
                Alert.alert('Success', 'Recipe deleted successfully');
              }, 100);
            } catch (error) {
              console.error('Error deleting recipe:', error);
              Alert.alert('Error', `Failed to delete recipe: ${error.message || 'Unknown error'}`);
            }
          },
        },
      ]
    );
  };

  const submitComment = async () => {
    if (!newComment.trim()) {
      return; // Just return silently if empty
    }

    try {
      const user = await authService.getCurrentUser();

      if (!user) {
        Alert.alert('Login Required', 'Please login to comment');
        return;
      }

      // Dismiss keyboard first for better UX
      Keyboard.dismiss();

      await commentsService.addComment(recipeId, user.id, newComment.trim());

      // Clear input and reload comments
      setNewComment('');
      await loadComments();

      // Success - no alert needed, comment appears in list
    } catch (error) {
      console.error('Error submitting comment:', error);
      Alert.alert('Error', 'Failed to submit comment. Please try again.');
    }
  };

  const renderStars = (difficulty) => {
    const difficultyMap = {
      'easy': 1,
      'medium': 2,
      'hard': 3,
      'very_hard': 4,
      'extreme': 5,
      'very_easy': 1,
    };
    const stars = difficultyMap[difficulty?.toLowerCase()] || 1;

    return (
      <View style={styles.starsContainer}>
        {[...Array(5)].map((_, index) => (
          <Ionicons
            key={index}
            name={index < stars ? "star" : "star-outline"}
            size={moderateScale(18)}
            color="#FFD700"
          />
        ))}
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#7CC57E" />
        <Text style={styles.loadingText}>Loading recipe...</Text>
      </SafeAreaView>
    );
  }

  if (!recipe) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Text style={styles.errorText}>Recipe not found</Text>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Image + Header */}
      <RecipeHeader navigation={navigation}
        recipe={recipe}
        currentUser={currentUser}
        isFavorite={isFavorite}
        onDelete={handleDeleteRecipe}
        onToggleFavorite={handleToggleFavorite}
      />
      {/* Tabs */}
      <RecipeTab activeTab={activeTab} setActiveTab={setActiveTab} comments={comments} />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        {/* Content */}
        <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
          {activeTab === 'recipe' ? (
            <>
              {/* Title and Rating */}
              <RecipeContent recipe={recipe} ingredients={ingredients} renderStars={renderStars} />
            </>
          ) : (
            <>
              {/* Comments Section */}
              <CommentContent navigation={navigation} comments={comments} commentsLoading={commentsLoading} />
            </>
          )}
        </ScrollView>

        {/* Comment Input (only show on comments tab) */}
        {activeTab === 'comments' && (
          <View style={styles.commentInputContainer}>
            <TextInput
              style={styles.commentInput}
              placeholder="Add a comment..."
              value={newComment}
              onChangeText={setNewComment}
              multiline
              maxLength={500}
              returnKeyType="send"
              blurOnSubmit={false}
            />
            <TouchableOpacity
              onPress={submitComment}
              style={styles.sendButton}
              activeOpacity={0.7}
            >
              <Ionicons name="send" size={moderateScale(24)} color="#7CC57E" />
            </TouchableOpacity>
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: verticalScale(10),
    color: '#666',
    fontSize: moderateScale(16),
  },
  errorText: {
    color: '#666',
    fontSize: moderateScale(18),
    marginBottom: verticalScale(20),
  },
  backButton: {
    backgroundColor: '#7CC57E',
    paddingHorizontal: scale(20),
    paddingVertical: verticalScale(10),
    borderRadius: 8,
  },
  backButtonText: {
    color: '#fff',
    fontSize: moderateScale(16),
    fontWeight: '600',
  },
  content: {
    flex: 1,
    backgroundColor: '#F3FFF4',
  },
  contentContainer: {
    paddingBottom: verticalScale(20),

  },
  starsContainer: {
    flexDirection: 'row',
    gap: scale(2),
  },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(12),
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  commentInput: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(10),
    fontSize: moderateScale(15),
    maxHeight: verticalScale(100),
    marginRight: scale(12),
  },
  sendButton: {
    padding: scale(8),
  },
});

