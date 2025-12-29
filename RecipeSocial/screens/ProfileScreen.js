import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Navbar from '../components/Navbar';
import { supabase } from '../lib/supabase';
import { scale, moderateScale } from '../utils/scaling';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function ProfileScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const [profile, setProfile] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [stats, setStats] = useState({ followers: 0, following: 0 });
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false); // <-- FOLLOW STATE

  const userId = route.params?.userId; // Optional userId for viewing other users

  useEffect(() => {
    getCurrentUser();
  }, []);

  useEffect(() => {
    if (currentUser) {
      fetchProfileAndRecipes();
    }
  }, [currentUser, userId]);

  useEffect(() => {
    if (route.params?.newAvatar) {
      setProfile(prev => prev ? { ...prev, avatar_url: route.params.newAvatar } : prev);
    }
  }, [route.params?.newAvatar]);

  const getCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setCurrentUser(user);
  };

  const fetchProfileAndRecipes = async () => {
    setLoading(true);

    try {
      let idToFetch = userId || currentUser?.id;
      if (!idToFetch) return;

      // Profile
      const { data: profileData, error: profileError } = await supabase
        .from('userinfo')
        .select('*')
        .eq('id', idToFetch)
        .single();
      if (!profileError) setProfile(profileData);

      // Recipes
      const { data: recipesData, error: recipesError } = await supabase
        .from('recipes')
        .select('*')
        .eq('user_id', idToFetch)
        .order('created_at', { ascending: false });
      if (!recipesError) setRecipes(recipesData || []);

      // Followers / Following counts
      const { count: followersCount } = await supabase
        .from('followers')
        .select('*', { count: 'exact', head: true })
        .eq('following_id', idToFetch);
      const { count: followingCount } = await supabase
        .from('followers')
        .select('*', { count: 'exact', head: true })
        .eq('follower_id', idToFetch);

      setStats({
        followers: followersCount || 0,
        following: followingCount || 0,
      });

      // Check if currentUser follows this profile
      if (currentUser && currentUser.id !== idToFetch) {
        const { data: followData } = await supabase
          .from('followers')
          .select('*')
          .eq('follower_id', currentUser.id)
          .eq('following_id', idToFetch)
          .single();
        setIsFollowing(!!followData);
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
        const { error } = await supabase
          .from('followers')
          .delete()
          .eq('follower_id', currentUser.id)
          .eq('following_id', profile.id);
        if (error) throw error;

        setIsFollowing(false);
        setStats(prev => ({ ...prev, followers: prev.followers - 1 }));
      } else {
        // Follow
        const { error } = await supabase
          .from('followers')
          .insert({ follower_id: currentUser.id, following_id: profile.id });
        if (error) throw error;

        setIsFollowing(true);
        setStats(prev => ({ ...prev, followers: prev.followers + 1 }));
      }
    } catch (err) {
      console.error('Error updating follow:', err);
      alert('Failed to update follow status');
    }
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
      <ScrollView contentContainerStyle={{ paddingBottom: scale(120) }}>
        {/* Header */}
        <View style={styles.header}>
          <Image
            source={
              profile?.avatar_url
                ? { uri: profile.avatar_url }
                : require('../assets/pfp.jpg')
            }
            style={styles.avatar}
          />

          <View style={{ flex: 1 }}>
            <Text style={styles.username}>{profile?.username}</Text>
            <Text style={styles.bio}>{profile?.bio || 'No bio yet'}</Text>
          </View>

          {/* Buttons */}
          {isOwnProfile ? (
            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity
                style={styles.editBtn}
                onPress={() => navigation.navigate('EditProfile')}
              >
                <Text style={styles.editText}>Edit</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.editBtn, { marginLeft: scale(8), backgroundColor: '#FF4C4C' }]}
                onPress={async () => {
                  const { error } = await supabase.auth.signOut();
                  if (error) {
                    alert('Logout failed: ' + error.message);
                  } else {
                    navigation.replace('Login');
                  }
                }}
              >
                <Text style={[styles.editText, { color: '#fff' }]}>Logout</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={[
                styles.editBtn,
                { backgroundColor: isFollowing ? '#ccc' : '#7CC57E' }
              ]}
              onPress={toggleFollow}
            >
              <Text style={[styles.editText, { color: isFollowing ? '#333' : '#fff' }]}>
                {isFollowing ? 'Following' : 'Follow'}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Stats */}
        <View style={styles.stats}>
          <Stat label="Reputation" value={profile?.reputation || 0} />
          <Stat label="Recipes" value={recipes.length} />
          <Stat label="Followers" value={stats.followers} />
          <Stat label="Following" value={stats.following} />
        </View>

        {/* Recipe Grid */}
        <View style={styles.grid}>
          {recipes.map((recipe) => (
            <TouchableOpacity
              key={recipe.id}
              style={styles.recipeCard}
              onPress={() => navigation.navigate('RecipeDetail', { recipeId: recipe.id })}
            >
              <Image
                source={
                  recipe.image_url
                    ? { uri: recipe.image_url }
                    : require('../assets/pfp.jpg')
                }
                style={styles.recipeImage}
              />
              <Ionicons
                name="heart"
                size={18}
                color="#444"
                style={styles.heart}
              />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <Navbar />
    </SafeAreaView>
  );
}


const Stat = ({ label, value }) => (
  <View style={styles.statItem}>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row', padding: scale(16), alignItems: 'center' },
  avatar: { width: scale(70), height: scale(70), borderRadius: 35, backgroundColor: '#ddd', marginRight: scale(12) },
  username: { fontSize: moderateScale(18), fontWeight: '700' },
  bio: { fontSize: moderateScale(12), color: '#666', marginVertical: 4 },
  editBtn: { backgroundColor: '#eee', paddingHorizontal: scale(12), paddingVertical: scale(6), borderRadius: 8 },
  editText: { fontSize: 12, fontWeight: '600' },
  stats: { flexDirection: 'row', justifyContent: 'space-around', marginVertical: scale(12) },
  statItem: { alignItems: 'center' },
  statValue: { fontWeight: '700', fontSize: 16 },
  statLabel: { fontSize: 11, color: '#666' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: scale(8) },
  recipeCard: { width: '31%', aspectRatio: 1, margin: '1%', borderRadius: 12, overflow: 'hidden', backgroundColor: '#ddd' },
  recipeImage: { width: '100%', height: '100%', borderRadius: 12 },
  heart: { position: 'absolute', top: 8, right: 8 },
});
