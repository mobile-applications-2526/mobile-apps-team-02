import { supabase } from '../lib/supabase';

export const userService = {
  /**
   * Get user profile by ID
   */
  getProfile: async (userId) => {
    const { data, error } = await supabase
      .from('userinfo')
      .select('*')
      .eq('id', userId)
      .single();
    if (error) throw error;
    return data;
  },

  /**
   * Update user profile
   */
  updateProfile: async (userId, updates) => {
    const { error } = await supabase
      .from('userinfo')
      .update(updates)
      .eq('id', userId);
    if (error) throw error;
  },

  /**
   * Get follower/following stats for a user
   */
  getStats: async (userId) => {
    const { count: followersCount } = await supabase
      .from('followers')
      .select('*', { count: 'exact', head: true })
      .eq('following_id', userId);

    const { count: followingCount } = await supabase
      .from('followers')
      .select('*', { count: 'exact', head: true })
      .eq('follower_id', userId);

    return {
      followers: followersCount || 0,
      following: followingCount || 0,
    };
  },

  /**
   * Check if current user is following another user
   */
  isFollowing: async (currentUserId, targetUserId) => {
    const { data } = await supabase
      .from('followers')
      .select('*')
      .eq('follower_id', currentUserId)
      .eq('following_id', targetUserId)
      .single();
    return !!data;
  },

  /**
   * Follow a user
   */
  followUser: async (followerId, followingId) => {
    const { error } = await supabase
      .from('followers')
      .insert({ follower_id: followerId, following_id: followingId });
    if (error) throw error;
  },

  /**
   * Unfollow a user
   */
  unfollowUser: async (followerId, followingId) => {
    const { error } = await supabase
      .from('followers')
      .delete()
      .eq('follower_id', followerId)
      .eq('following_id', followingId);
    if (error) throw error;
  },

  /**
   * Get list of followers
   */
  getFollowers: async (userId) => {
    const { data, error } = await supabase
      .from('followers')
      .select('follower_id, userinfo!followers_follower_id_fkey(*)')
      .eq('following_id', userId);

    if (error) throw error;
    return data.map(item => item.userinfo);
  },

  /**
   * Get list of users being followed
   */
  getFollowing: async (userId) => {
    const { data, error } = await supabase
      .from('followers')
      .select('following_id, userinfo!followers_following_id_fkey(*)')
      .eq('follower_id', userId);

    if (error) throw error;
    return data.map(item => item.userinfo);
  },

  /**
   * Upload avatar image to storage
   */
  uploadAvatar: async (uri, userId) => {
    const fileExt = uri.split('.').pop() || 'jpg';
    const { v4: uuidv4 } = require('uuid');
    const filePath = `${uuidv4()}.${fileExt}`;

    const response = await fetch(uri);
    const arrayBuffer = await response.arrayBuffer();

    const { error } = await supabase.storage
      .from('profile-images')
      .upload(filePath, arrayBuffer, { upsert: false, contentType: 'image/*' });

    if (error) throw error;

    const { data } = supabase.storage.from('profile-images').getPublicUrl(filePath);
    return data.publicUrl;
  },
};

