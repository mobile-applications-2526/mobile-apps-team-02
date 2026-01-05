import { supabase } from '../lib/supabase';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

export async function uploadRecipeImage(uri) {
  const fileExt = uri.split('.').pop() || 'jpg';
  const filePath = `${uuidv4()}.${fileExt}`;

  const response = await fetch(uri);
  const arrayBuffer = await response.arrayBuffer();

  const { error } = await supabase.storage
    .from('recipe-images')
    .upload(filePath, arrayBuffer, {
      upsert: false,
      contentType: 'image/*',
    });

  if (error) throw error;

  const { data } = supabase.storage
    .from('recipe-images')
    .getPublicUrl(filePath);

  return data.publicUrl;
}

export async function createRecipe({
  title,
  description,
  difficulty,
  prepTime,
  image,
  categories,
  ingredients,
}) {
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) throw new Error('Not authenticated');

  let imageUrl = image;
  if (image && image.startsWith('file://')) {
    imageUrl = await uploadRecipeImage(image);
  }

  const { data: recipe, error: recipeError } = await supabase
    .from('recipes')
    .insert({
      user_id: user.id,
      title,
      description,
      difficulty,
      prep_time: prepTime,
      image_url: imageUrl,
    })
    .select()
    .single();

  if (recipeError) throw recipeError;

  if (categories.length) {
    const categoryRows = categories.map(catId => ({
      recipe_id: recipe.id,
      category_id: catId,
    }));
    const { error } = await supabase
      .from('recipe_categories')
      .insert(categoryRows);
    if (error) throw error;
  }

  if (ingredients.length) {
    const ingredientRows = ingredients.map(i => ({
      recipe_id: recipe.id,
      ingredient: i.ingredient,
      quantity: i.size,
    }));
    const { error } = await supabase
      .from('recipe_ingredients')
      .insert(ingredientRows);
    if (error) throw error;
  }

  return recipe;
}
