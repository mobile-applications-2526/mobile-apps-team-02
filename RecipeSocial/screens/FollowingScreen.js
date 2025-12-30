import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../lib/supabase';
import { scale, moderateScale } from '../utils/scaling';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function FollowingScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = route.params?.userId;

  useEffect(() => {
    fetchFollowing();
  }, [userId]);

  const fetchFollowing = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('followers')
        .select('following_id, userinfo!followers_following_id_fkey(*)')
        .eq('follower_id', userId);

      if (error) throw error;

      const followingList = data.map(item => item.userinfo);
      setFollowing(followingList);
    } catch (error) {
      console.error('Error fetching following:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderUser = ({ item }) => (
    <TouchableOpacity
      style={styles.userCard}
      onPress={() => navigation.navigate('Profile', { userId: item.id })}
    >
      <Image
        source={
          item.avatar_url
            ? { uri: item.avatar_url }
            : require('../assets/pfp.jpg')
        }
        style={styles.avatar}
      />
      <View style={styles.userInfo}>
        <Text style={styles.username}>{item.username}</Text>
        {item.bio && <Text style={styles.bio} numberOfLines={1}>{item.bio}</Text>}
      </View>
      <Ionicons name="chevron-forward" size={24} color="#666" />
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#7CC57E" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Following</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* List */}
      {following.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Not following anyone yet</Text>
        </View>
      ) : (
        <FlatList
          data={following}
          renderItem={renderUser}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
        />
      )}
    </SafeAreaView>
  );
}

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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: scale(16),
    paddingVertical: scale(12),
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: moderateScale(18),
    fontWeight: '700',
  },
  listContent: {
    paddingHorizontal: scale(16),
    paddingTop: scale(8),
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: scale(12),
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  avatar: {
    width: scale(50),
    height: scale(50),
    borderRadius: 25,
    backgroundColor: '#ddd',
    marginRight: scale(12),
  },
  userInfo: {
    flex: 1,
  },
  username: {
    fontSize: moderateScale(16),
    fontWeight: '600',
    marginBottom: 2,
  },
  bio: {
    fontSize: moderateScale(12),
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: moderateScale(16),
    color: '#999',
  },
});

