import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { scale, moderateScale } from '../utils/scaling';

export default function UserListItem({ user, onPress }) {
  return (
    <TouchableOpacity style={styles.userCard} onPress={onPress}>
      <Image
        source={
          user.avatar_url
            ? { uri: user.avatar_url }
            : require('../assets/pfp.jpg')
        }
        style={styles.avatar}
      />
      <View style={styles.userInfo}>
        <Text style={styles.username}>{user.username}</Text>
        {user.bio && <Text style={styles.bio} numberOfLines={1}>{user.bio}</Text>}
      </View>
      <Ionicons name="chevron-forward" size={24} color="#666" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
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
});

