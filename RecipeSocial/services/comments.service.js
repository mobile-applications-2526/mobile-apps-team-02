import { supabase } from '../lib/supabase';

export const commentsService = {
  /**
   * Get comments for a recipe
   */
  getComments: async (recipeId) => {
    const { data, error } = await supabase
      .from('comments')
      .select(`
        *,
        user:userinfo(id, username, avatar_url)
      `)
      .eq('recipe_id', recipeId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  /**
   * Add a comment to a recipe
   */
  addComment: async (recipeId, userId, content) => {
    const { data, error } = await supabase
      .from('comments')
      .insert({
        recipe_id: recipeId,
        user_id: userId,
        content,
      })
      .select(`
        *,
        user:userinfo(id, username, avatar_url)
      `)
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Delete a comment
   */
  deleteComment: async (commentId, userId) => {
    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('id', commentId)
      .eq('user_id', userId);

    if (error) throw error;
  },
};

