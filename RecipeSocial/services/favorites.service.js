import { supabase } from "../lib/supabase";

export async function fetchFavorites() {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Not authenticated");
  }

  const { data, error } = await supabase
    .from("favorites")
    .select(`
      recipe_id,
      recipes (
        id,
        title,
        image_url
      )
    `)
    .eq("user_id", user.id);

  if (error) throw error;
  return data || [];
}

export async function deleteFavorite(recipeId) {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Not authenticated");
  }

  const { error } = await supabase
    .from("favorites")
    .delete()
    .eq("user_id", user.id)
    .eq("recipe_id", recipeId);

  if (error) throw error;
}
