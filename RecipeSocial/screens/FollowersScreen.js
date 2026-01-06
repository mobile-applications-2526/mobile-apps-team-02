import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { userService } from '../services/user.service';
import { scale, moderateScale } from '../utils/scaling';
import { useNavigation, useRoute } from '@react-navigation/native';
import UserListItem from '../components/UserListItem';
import EmptyState from '../components/EmptyState';

export default function FollowersScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const [followers, setFollowers] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = route.params?.userId;

  useEffect(() => {
    fetchFollowers();
  }, [userId]);

  const fetchFollowers = async () => {
    setLoading(true);
    try {
      const followersList = await userService.getFollowers(userId);
      setFollowers(followersList);
    } catch (error) {
      console.error('Error fetching followers:', error);
    } finally {
      setLoading(false);
    }
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
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Followers</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* List */}
      {followers.length === 0 ? (
        <EmptyState
          icon="people-outline"
          title="No followers yet"
        />
      ) : (
        <FlatList
          data={followers}
          renderItem={({ item }) => (
            <UserListItem
              user={item}
              onPress={() => navigation.navigate('Profile', { userId: item.id })}
            />
          )}
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
});

