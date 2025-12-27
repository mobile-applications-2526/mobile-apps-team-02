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
        .select('*')
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
      'very easy': 1,
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
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backIcon}>
          <Ionicons name="arrow-back" size={moderateScale(28)} color="#333" />
        </TouchableOpacity>
        <TouchableOpacity onPress={toggleFavorite} style={styles.favoriteIcon}>
          <Ionicons
            name={isFavorite ? "heart" : "heart-outline"}
            size={moderateScale(28)}
            color={isFavorite ? "#ff4444" : "#333"}
          />
        </TouchableOpacity>
      </View>

      {/* Recipe Image */}
      <View style={styles.imageContainer}>
        <Image
          source={recipe.image_url ? { uri: recipe.image_url } : require('../assets/testRecipe.jpg')}
          style={styles.recipeImage}
        />
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'recipe' && styles.activeTab]}
          onPress={() => setActiveTab('recipe')}
        >
          <Text style={[styles.tabText, activeTab === 'recipe' && styles.activeTabText]}>
            Recipe
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'comments' && styles.activeTab]}
          onPress={() => setActiveTab('comments')}
        >
          <Text style={[styles.tabText, activeTab === 'comments' && styles.activeTabText]}>
            {comments.length} Comments
          </Text>
        </TouchableOpacity>
      </View>

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
              <View style={styles.titleContainer}>
                <Text style={styles.title}>{recipe.title}</Text>
                <Text style={styles.description}>{recipe.description}</Text>
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
              </View>

              {/* Ingredients */}
              {ingredients.length > 0 && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Ingredients</Text>
                  {ingredients.map((item, index) => (
                    <View key={index} style={styles.ingredientItem}>
                      <Ionicons name="checkmark-circle" size={moderateScale(20)} color="#7CC57E" />
                      <Text style={styles.ingredientText}>
                        {item.quantity} {item.ingredient}
                      </Text>
                    </View>
                  ))}
                </View>
              )}

              {/* Instructions */}
              {recipe.instructions && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Instructions</Text>
                  <Text style={styles.instructionsText}>{recipe.instructions}</Text>
                </View>
              )}
            </>
          ) : (
            <>
              {/* Comments Section */}
              <View style={styles.commentsSection}>
                {(() => {
                  console.log('Rendering comments section. commentsLoading:', commentsLoading, 'comments.length:', comments.length);
                  console.log('Comments state:', JSON.stringify(comments, null, 2));
                  return null;
                })()}
                {commentsLoading ? (
                  <ActivityIndicator size="small" color="#7CC57E" />
                ) : comments.length === 0 ? (
                  <Text style={styles.noCommentsText}>No comments yet. Be the first to comment!</Text>
                ) : (
                  comments.map((comment) => (
                    <View key={comment.id} style={styles.commentItem}>
                      <View style={styles.commentHeader}>
                        <View style={styles.commentAvatar}>
                          {comment.user?.avatar_url ? (
                            <Image
                              source={{ uri: comment.user.avatar_url }}
                              style={styles.avatarImage}
                            />
                          ) : (
                            <Ionicons name="person-circle" size={moderateScale(40)} color="#ccc" />
                          )}
                        </View>
                        <View style={styles.commentInfo}>
                          <Text style={styles.commentUsername}>
                            {comment.user?.username || 'Anonymous'}
                          </Text>
                          <Text style={styles.commentDate}>
                            {new Date(comment.created_at).toLocaleDateString()}
                          </Text>
                        </View>
                      </View>
                      <Text style={styles.commentContent}>{comment.content}</Text>
                    </View>
                  ))
                )}
              </View>
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
  imageContainer: {
    width: '100%',
    height: verticalScale(250),
    backgroundColor: '#f0f0f0',
  },
  recipeImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tab: {
    flex: 1,
    paddingVertical: verticalScale(12),
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#7CC57E',
  },
  tabText: {
    fontSize: moderateScale(16),
    color: '#666',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#7CC57E',
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: verticalScale(20),
  },
  titleContainer: {
    paddingHorizontal: scale(16),
    paddingTop: verticalScale(16),
    paddingBottom: verticalScale(12),
  },
  title: {
    fontSize: moderateScale(28),
    fontWeight: 'bold',
    color: '#333',
    marginBottom: verticalScale(8),
  },
  description: {
    fontSize: moderateScale(16),
    color: '#666',
    marginBottom: verticalScale(12),
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
  commentsSection: {
    paddingHorizontal: scale(16),
    paddingTop: verticalScale(16),
  },
  noCommentsText: {
    fontSize: moderateScale(16),
    color: '#999',
    textAlign: 'center',
    paddingVertical: verticalScale(40),
  },
  commentItem: {
    marginBottom: verticalScale(16),
    paddingBottom: verticalScale(16),
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(8),
  },
  commentAvatar: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(20),
    overflow: 'hidden',
    marginRight: scale(12),
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  commentInfo: {
    flex: 1,
  },
  commentUsername: {
    fontSize: moderateScale(16),
    fontWeight: '600',
    color: '#333',
  },
  commentDate: {
    fontSize: moderateScale(12),
    color: '#999',
    marginTop: verticalScale(2),
  },
  commentContent: {
    fontSize: moderateScale(15),
    color: '#333',
    lineHeight: moderateScale(22),
    marginLeft: moderateScale(52),
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

