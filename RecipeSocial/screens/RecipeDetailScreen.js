import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { scale, verticalScale, moderateScale } from '../utils/scaling';
import { supabase } from '../lib/supabase';
import IngredientsList from '../components/IngredientsList';
import RecipeHeader from '../components/DetailScreen/RecipeHeader';
import  RecipeTab from '../components/DetailScreen/RecipeTab';
import RecipeContent from '../components/DetailScreen/RecipeContent';
import CommentContent from '../components/DetailScreen/CommentContent';

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
    checkIfFavorite();
    getCurrentUser();
  }, [recipeId]);

  const getCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setCurrentUser(user);
  };

  const loadRecipeDetails = async () => {
    try {
      setLoading(true);

      // Fetch recipe details
      const { data: recipeData, error: recipeError } = await supabase
        .from('recipes')
        .select(`*,   user:userinfo!recipes_user_id_fkey (
          id,
         username,
         avatar_url
         )
          `)
        .eq('id', recipeId)
        .single();

      if (recipeError) throw recipeError;

      setRecipe(recipeData);

      // Fetch ingredients
      const { data: ingredientsData, error: ingredientsError } = await supabase
        .from('recipe_ingredients')
        .select('ingredient, quantity')
        .eq('recipe_id', recipeId);

      if (ingredientsError) throw ingredientsError;

      setIngredients(ingredientsData || []);
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

      // Fetch comments
      const { data: commentsData, error: commentsError } = await supabase
        .from('comments')
        .select('*')
        .eq('recipe_id', recipeId)
        .order('created_at', { ascending: false });

      if (commentsError) throw commentsError;

      console.log('Comments fetched:', commentsData?.length || 0, 'comments');
      console.log('Comments data:', JSON.stringify(commentsData, null, 2));

      if (!commentsData || commentsData.length === 0) {
        console.log('No comments found for this recipe');
        setComments([]);
        return;
      }

      // Get unique user IDs
      const userIds = [...new Set(commentsData.map(c => c.user_id))];
      console.log('Fetching user info for:', userIds);

      // Fetch user info for all users who commented
      const { data: usersData, error: usersError } = await supabase
        .from('userinfo')
        .select('id, username, avatar_url')
        .in('id', userIds);

      if (usersError) {
        console.error('Error loading user info:', usersError);
        // Still show comments without user info
        setComments(commentsData.map(comment => ({
          ...comment,
          user: { username: 'Anonymous' }
        })));
        return;
      }

      console.log('Users data fetched:', usersData?.length || 0, 'users');
      console.log('Users data:', JSON.stringify(usersData, null, 2));

      // Map user info to comments
      const usersMap = {};
      (usersData || []).forEach(user => {
        usersMap[user.id] = user;
      });

      const commentsWithUsers = commentsData.map(comment => ({
        ...comment,
        user: usersMap[comment.user_id] || { username: 'Anonymous' }
      }));

      console.log('Final comments with users:', JSON.stringify(commentsWithUsers, null, 2));
      setComments(commentsWithUsers);
    } catch (error) {
      console.error('Error loading comments:', error);
      setComments([]);
    } finally {
      setCommentsLoading(false);
    }
  };

  const checkIfFavorite = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('favorites')
        .select('id')
        .eq('user_id', user.id)
        .eq('recipe_id', recipeId)
        .single();

      if (!error && data) {
        setIsFavorite(true);
      }
    } catch (error) {
      // Not a favorite or error
      setIsFavorite(false);
    }
  };

  const toggleFavorite = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        Alert.alert('Login Required', 'Please login to save favorites');
        return;
      }

      if (isFavorite) {
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('recipe_id', recipeId);

        if (error) throw error;
        setIsFavorite(false);
      } else {
        const { error } = await supabase
          .from('favorites')
          .insert({ user_id: user.id, recipe_id: recipeId });

        if (error) throw error;
        setIsFavorite(true);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      Alert.alert('Error', 'Failed to update favorite');
    }
  };

  const deleteRecipe = async () => {
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
              const { data: { user } } = await supabase.auth.getUser();

              if (!user) {
                Alert.alert('Error', 'You must be logged in to delete recipes');
                return;
              }

              console.log('Attempting to delete recipe:', recipeId, 'by user:', user.id);

              // Delete the recipe - ensure user owns it
              const { error } = await supabase
                .from('recipes')
                .delete()
                .eq('id', recipeId)
                .eq('user_id', user.id);

              if (error) {
                console.error('Delete error:', JSON.stringify(error, null, 2));
                throw error;
              }

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
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        Alert.alert('Login Required', 'Please login to comment');
        return;
      }

      // Dismiss keyboard first for better UX
      Keyboard.dismiss();

      const { error } = await supabase
        .from('comments')
        .insert({
          recipe_id: recipeId,
          user_id: user.id,
          content: newComment.trim(),
        });

      if (error) throw error;

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
        onDelete={deleteRecipe}
        onToggleFavorite={toggleFavorite}
        styles={styles} />
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(12),
  },
  backIcon: {
    padding: scale(8),
  },
  favoriteIcon: {
    padding: scale(8),
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
  section: {
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(16),
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  sectionTitle: {
    fontSize: moderateScale(22),
    fontWeight: 'bold',
    color: '#333',
    marginBottom: verticalScale(12),
  },
  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(10),
    marginBottom: verticalScale(8),
  },
  ingredientText: {
    fontSize: moderateScale(16),
    color: '#333',
    flex: 1,
  },
  instructionsText: {
    fontSize: moderateScale(16),
    color: '#333',
    lineHeight: moderateScale(24),
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

