import { supabase } from '../lib/supabase';

export const authService = {
  /**
   * Get current user
   */
  getCurrentUser: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  },

  /**
   * Sign in with email and password
   */
  signIn: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  },

  /**
   * Sign up with email, password, and username
   */
  signUp: async (email, password, username) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username: username,
        }
      }
    });
    if (error) throw error;
    return data;
  },

  /**
   * Sign out
   */
  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  /**
   * Update user email
   */
  updateEmail: async (email) => {
    const { error } = await supabase.auth.updateUser({ email });
    if (error) throw error;
  },

  /**
   * Check for existing session
   */
  checkSession: async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      return session;
    } catch (error) {
      console.error('Error checking session:', error);
      return null;
    }
  },

  /**
   * Setup auth state change listener
   */
  setupAuthListener: (callback) => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(callback);
    return subscription;
  },
};


