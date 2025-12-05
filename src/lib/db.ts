import { promises as fs } from 'fs';
import path from 'path';

const dbPath = path.join(process.cwd(), 'recipes.json');

export interface Recipe {
  id: number;
  title: string;
  author: string;
  description: string;
  ingredients: string;
  instructions: string;
  imageUrl: string;
  createdAt: string;
}

interface Database {
  recipes: Recipe[];
  nextId: number;
}

async function readDatabase(): Promise<Database> {
  try {
    const data = await fs.readFile(dbPath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // If file doesn't exist, create initial structure
    const initialDb: Database = { recipes: [], nextId: 1 };
    await writeDatabase(initialDb);
    return initialDb;
  }
}

async function writeDatabase(db: Database): Promise<void> {
  await fs.writeFile(dbPath, JSON.stringify(db, null, 2), 'utf-8');
}

export const getAllRecipes = async (): Promise<Recipe[]> => {
  const db = await readDatabase();
  return db.recipes;
};

export const getRecipeById = async (id: number): Promise<Recipe | undefined> => {
  const db = await readDatabase();
  return db.recipes.find(recipe => recipe.id === id);
};

export const createRecipe = async (recipe: Omit<Recipe, 'id' | 'createdAt'>): Promise<Recipe> => {
  const db = await readDatabase();

  const newRecipe: Recipe = {
    ...recipe,
    id: db.nextId,
    createdAt: new Date().toISOString()
  };

  db.recipes.push(newRecipe);
  db.nextId++;

  await writeDatabase(db);

  return newRecipe;
};

export const updateRecipe = async (id: number, updates: Partial<Omit<Recipe, 'id' | 'createdAt'>>): Promise<Recipe | null> => {
  const db = await readDatabase();
  const index = db.recipes.findIndex(r => r.id === id);

  if (index === -1) return null;

  const updatedRecipe = { ...db.recipes[index], ...updates };
  db.recipes[index] = updatedRecipe;

  await writeDatabase(db);
  return updatedRecipe;
};

export const deleteRecipe = async (id: number): Promise<boolean> => {
  const db = await readDatabase();
  const initialLength = db.recipes.length;
  db.recipes = db.recipes.filter(r => r.id !== id);

  if (db.recipes.length === initialLength) return false;

  await writeDatabase(db);
  return true;
};
