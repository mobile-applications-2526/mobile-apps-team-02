import { supabase } from '../lib/supabase';

export const collectionsService = {
  /**
   * Get all collections (favorites) for current user
   */
  getCollections: async (userId) => {
    const { data, error } = await supabase
      .from('favorites')
      .select(`
        *,
        recipes(*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  /**
   * Add recipe to collections
   */
  addToCollection: async (userId, recipeId) => {
    const { error } = await supabase
      .from('favorites')
      .insert({ user_id: userId, recipe_id: recipeId });

    if (error) throw error;
  },

  /**
   * Remove recipe from collections
   */
  removeFromCollection: async (userId, recipeId) => {
    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', userId)
      .eq('recipe_id', recipeId);

    if (error) throw error;
  },
};

