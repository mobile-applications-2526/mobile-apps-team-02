import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { scale, moderateScale } from '../utils/scaling';

export default function ProfileHeader({
  profile,
  isOwnProfile,
  isFollowing,
  onEditPress,
  onLogoutPress,
  onFollowPress,
}) {
  return (
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
            onPress={onEditPress}
          >
            <Text style={styles.editText}>Edit</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.editBtn, { marginLeft: scale(8), backgroundColor: '#FF4C4C' }]}
            onPress={onLogoutPress}
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
          onPress={onFollowPress}
        >
          <Text style={[styles.editText, { color: isFollowing ? '#333' : '#fff' }]}>
            {isFollowing ? 'Following' : 'Follow'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
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
});

