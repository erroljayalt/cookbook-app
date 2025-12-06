import { supabase } from './supabase';

export interface Recipe {
  id: number;
  title: string;
  author: string;
  description: string;
  ingredients: string;
  instructions: string;
  imageUrl: string;
  chibiUrl?: string;
  servingSuggestions?: string;
  createdAt: string;
}

export const getAllRecipes = async (): Promise<Recipe[]> => {
  const { data, error } = await supabase
    .from('recipes')
    .select('*')
    .order('createdAt', { ascending: true })
    .order('id', { ascending: true });

  if (error) {
    console.error('Supabase Error fetching recipes:', error);
    return [];
  }
  return data || [];
};

export const getRecipeById = async (id: number): Promise<Recipe | undefined> => {
  const { data, error } = await supabase
    .from('recipes')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    // If error is code 'PGRST116' it means no rows returned (not found), which is fine to return undefined
    if (error.code !== 'PGRST116') {
      console.error('Supabase Error fetching recipe by id:', error);
    }
    return undefined;
  }
  return data;
};

export const createRecipe = async (recipe: Omit<Recipe, 'id' | 'createdAt'>): Promise<Recipe> => {
  // We assume the DB generates id and createdAt
  const { data, error } = await supabase
    .from('recipes')
    .insert(recipe)
    .select()
    .single();

  if (error) {
    console.error('Supabase Error creating recipe:', error);
    throw new Error('Failed to create recipe');
  }
  return data;
};

export const updateRecipe = async (id: number, updates: Partial<Omit<Recipe, 'id' | 'createdAt'>>): Promise<Recipe | null> => {
  const { data, error } = await supabase
    .from('recipes')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Supabase Error updating recipe:', error);
    return null;
  }
  return data;
};

export const deleteRecipe = async (id: number): Promise<boolean> => {
  const { error, count } = await supabase
    .from('recipes')
    .delete({ count: 'exact' })
    .eq('id', id);

  if (error) {
    console.error('Supabase Error deleting recipe:', error);
    return false;
  }

  return count !== null && count > 0;
};
