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

export async function loadFavorites() {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return new Set();
  }

  const { data, error } = await supabase
    .from("favorites")
    .select("recipe_id")
    .eq("user_id", user.id);

  if (error) {
    console.error('Error loading favorites:', error);
    return new Set();
  }

  return new Set(data?.map(fav => fav.recipe_id) || []);
}

export async function checkIfFavorite(recipeId) {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return false;
  }

  const { data, error } = await supabase
    .from("favorites")
    .select("recipe_id")
    .eq("user_id", user.id)
    .eq("recipe_id", recipeId)
    .maybeSingle();

  if (error) {
    console.error('Error checking favorite:', error);
    return false;
  }

  return data !== null;
}

export async function toggleFavorite(recipeId) {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Not authenticated");
  }

  // First, check if the favorite exists
  const { data: existingFavorite, error: checkError } = await supabase
    .from("favorites")
    .select("recipe_id")
    .eq("user_id", user.id)
    .eq("recipe_id", recipeId)
    .maybeSingle();

  if (checkError) {
    console.error('Error checking favorite:', checkError);
    throw checkError;
  }

  if (existingFavorite) {
    // Remove from favorites
    const { error } = await supabase
      .from("favorites")
      .delete()
      .eq("user_id", user.id)
      .eq("recipe_id", recipeId);

    if (error) throw error;
    return false;
  } else {
    // Add to favorites
    const { error } = await supabase
      .from("favorites")
      .insert({ user_id: user.id, recipe_id: recipeId });

    if (error) throw error;
    return true;
  }
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
