import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Navbar from '../components/Navbar';
import ProfileHeader from '../components/ProfileHeader';
import Stat from '../components/Stat';
import { authService } from '../services/auth.service';
import { userService } from '../services/user.service';
import { getUserRecipes, deleteRecipe } from '../services/recipes.service';
import { loadFavorites, toggleFavorite } from '../services/favorites.service';
import { scale, moderateScale } from '../utils/scaling';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import VerticalRecipe from '../components/VerticalRecipe';

export default function ProfileScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const [profile, setProfile] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [stats, setStats] = useState({ followers: 0, following: 0 });
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [favorites, setFavorites] = useState([]);

  const userId = route.params?.userId;

  useEffect(() => {
    getCurrentUser();
  }, []);

  useEffect(() => {
    if (route.params?.newAvatar) {
      setProfile(prev => prev ? { ...prev, avatar_url: route.params.newAvatar } : prev);
    }
  }, [route.params?.newAvatar]);

  // Refresh profile and recipes when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      console.log('ProfileScreen: useFocusEffect triggered');
      if (currentUser) {
        setRefreshKey(prev => prev + 1);
        fetchProfileAndRecipes();
      }
    }, [currentUser, userId])
  );

  const getCurrentUser = async () => {
    const user = await authService.getCurrentUser();
    setCurrentUser(user);
  };

  const fetchProfileAndRecipes = async () => {
    console.log('ProfileScreen: Fetching profile and recipes... (refreshKey:', refreshKey, ')');
    setLoading(true);

    try {
      let idToFetch = userId || currentUser?.id;
      if (!idToFetch) return;

      console.log('ProfileScreen: Fetching for user ID:', idToFetch);

      // Profile
      const profileData = await userService.getProfile(idToFetch);
      setProfile(profileData);

      // Recipes - use recipes service
      const recipesData = await getUserRecipes(idToFetch);
      console.log('ProfileScreen: Loaded', recipesData?.length || 0, 'recipes');
      setRecipes(recipesData);

      // Followers / Following counts
      const statsData = await userService.getStats(idToFetch);
      setStats(statsData);

      // Check if currentUser follows this profile
      if (currentUser && currentUser.id !== idToFetch) {
        const following = await userService.isFollowing(currentUser.id, idToFetch);
        setIsFollowing(following);
      }

    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFollow = async () => {
    if (!currentUser) {
      alert('You must be logged in to follow users.');
      return;
    }

    try {
      if (isFollowing) {
        // Unfollow
        await userService.unfollowUser(currentUser.id, profile.id);
        setIsFollowing(false);
        setStats(prev => ({ ...prev, followers: prev.followers - 1 }));
      } else {
        // Follow
        await userService.followUser(currentUser.id, profile.id);
        setIsFollowing(true);
        setStats(prev => ({ ...prev, followers: prev.followers + 1 }));
      }
    } catch (err) {
      console.error('Error updating follow:', err);
      alert('Failed to update follow status');
    }
  };

  const loadUserFavorites = async () => {
    try {
      const favSet = await loadFavorites();
      setFavorites(favSet);
    } catch (err) {
      console.error('Error loading favorites:', err);
    }
  };
  useEffect(() => {
    loadUserFavorites();
  }, []);
  const handleToggleFavorite = async (recipeId, recipeTitle) => {
    const wasInFavorites = favorites.has(recipeId);

    if (wasInFavorites) {
      // Show confirmation before removing
      Alert.alert(
        'Remove from Collections',
        `Remove "${recipeTitle}" from your collections?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Remove',
            style: 'destructive',
            onPress: async () => {
              try {
                await toggleFavorite(recipeId);
                const newFavorites = new Set(favorites);
                newFavorites.delete(recipeId);
                setFavorites(newFavorites);
                Alert.alert('Success', 'Removed from collections');
              } catch (err) {
                console.error('Error removing favorite:', err);
                Alert.alert('Error', err.message);
              }
            },
          },
        ]
      );
    } else {
      // Add to favorites without confirmation
      try {
        await toggleFavorite(recipeId);
        const newFavorites = new Set(favorites);
        newFavorites.add(recipeId);
        setFavorites(newFavorites);
        Alert.alert('Success', 'Added to collections');
      } catch (err) {
        console.error('Error adding favorite:', err);
        if (err.message === 'Not authenticated') {
          Alert.alert('Login Required', 'Please login to save favorites');
        } else {
          Alert.alert('Error', err.message);
        }
      }
    }
  };


  const handleDeleteRecipe = async (recipeId) => {
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
              if (!currentUser) {
                Alert.alert('Error', 'You must be logged in to delete recipes');
                return;
              }

              console.log('Attempting to delete recipe:', recipeId, 'by user:', currentUser.id);

              await deleteRecipe(recipeId, currentUser.id);

              console.log('Delete successful');

              // Refresh recipes list
              await fetchProfileAndRecipes();
              Alert.alert('Success', 'Recipe deleted successfully');
            } catch (error) {
              console.error('Error deleting recipe:', error);
              Alert.alert('Error', `Failed to delete recipe: ${error.message || 'Unknown error'}`);
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#7CC57E" />
      </View>
    );
  }

  const isOwnProfile = currentUser?.id === profile?.id;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <ProfileHeader
          profile={profile}
          isOwnProfile={isOwnProfile}
          isFollowing={isFollowing}
          onEditPress={() => navigation.navigate('EditProfile', { profile })}
          onLogoutPress={async () => {
            try {
              await authService.signOut();
              navigation.replace('Login');
            } catch (error) {
              Alert.alert('Logout failed', error.message);
            }
          }}
          onFollowPress={toggleFollow}
        />

        {/* Stats */}
        <View style={styles.stats}>
          <View style={styles.statItem}>
          <Stat label="Reputation" value={profile?.reputation || 0} />
          </View>
          <View style={styles.statItem}>
          <Stat label="Recipes" value={recipes.length} />
          </View>
          <TouchableOpacity  style={styles.statItem} onPress={() => navigation.navigate('Followers', { userId: profile?.id })}>
            <Stat label="Followers" value={stats.followers} />
          </TouchableOpacity>
          <TouchableOpacity  style={[styles.statItem, styles.statItemLast]} onPress={() => navigation.navigate('Following', { userId: profile?.id })}>
            <Stat label="Following" value={stats.following} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: scale(120) }} key={refreshKey}>
        {/* Recipe Grid */}
        <VerticalRecipe
          recipes={recipes}
          favorites={favorites}
          onPress={(recipeId) => navigation.navigate('RecipeDetail', { recipeId })}
          onToggleFavorite={(recipeId, recipeTitle) => handleToggleFavorite(recipeId, recipeTitle)}
          isOwnProfile={isOwnProfile}
          onDeleteRecipe={handleDeleteRecipe}
        />
      </ScrollView>

      <Navbar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { borderBottomWidth: scale(1.5), borderBottomColor: '#E5E5E5', },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  stats: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: scale(12), backgroundColor: '#DAFFDB' },
  statItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRightWidth: 1,
    borderRightColor: '#E5E5E5',
  },
  statItemLast: {
    borderRightWidth: 0,
  },

});
