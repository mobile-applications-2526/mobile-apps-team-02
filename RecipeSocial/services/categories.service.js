import { supabase } from "../lib/supabase";

export async function fetchCategoriesWithRecipes() {
  const { data, error } = await supabase
    .from("categories")
    .select(`
      id,
      name,
      recipe_categories (
        recipe:recipes (
          id,
          title,
          image_url
        )
      )
    `);

  if (error) throw error;
  return data ?? [];
}
