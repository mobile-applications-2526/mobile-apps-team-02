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

export default function ProfileScreen() {
  const [profile, setProfile] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [stats, setStats] = useState({ followers: 0, following: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfileAndRecipes();
  }, []);

  const fetchProfileAndRecipes = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    // Fetch user profile
    const { data: profileData, error: profileError } = await supabase
      .from('userinfo')
      .select('*')
      .eq('id', user.id)
      .single();

    if (!profileError) setProfile(profileData);

    // Fetch user recipes
    const { data: recipesData, error: recipesError } = await supabase
      .from('recipes')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (!recipesError) setRecipes(recipesData);

    // Fetch followers count
    const { count: followersCount } = await supabase
      .from('followers')
      .select('*', { count: 'exact', head: true })
      .eq('following_id', user.id);

    // Fetch following count
    const { count: followingCount } = await supabase
      .from('followers')
      .select('*', { count: 'exact', head: true })
      .eq('follower_id', user.id);

    setStats({
      followers: followersCount || 0,
      following: followingCount || 0,
    });

    setLoading(false);
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#7CC57E" />
      </View>
    );
  }

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

          <TouchableOpacity style={styles.editBtn}>
            <Text style={styles.editText}>Edit</Text>
          </TouchableOpacity>
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
            <View key={recipe.id} style={styles.recipeCard}>
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
            </View>
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
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    padding: scale(16),
    alignItems: 'center',
  },
  avatar: {
    width: scale(70),
    height: scale(70),
    borderRadius: 35,
    backgroundColor: '#ddd',
    marginRight: scale(12),
  },
  username: {
    fontSize: moderateScale(18),
    fontWeight: '700',
  },
  bio: {
    fontSize: moderateScale(12),
    color: '#666',
    marginVertical: 4,
  },
  editBtn: {
    backgroundColor: '#eee',
    paddingHorizontal: scale(12),
    paddingVertical: scale(6),
    borderRadius: 8,
  },
  editText: {
    fontSize: 12,
    fontWeight: '600',
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: scale(12),
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontWeight: '700',
    fontSize: 16,
  },
  statLabel: {
    fontSize: 11,
    color: '#666',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: scale(8),
  },
  recipeCard: {
    width: '31%',
    aspectRatio: 1,
    margin: '1%',
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#ddd',
  },
  recipeImage: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  heart: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
});
