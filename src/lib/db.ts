const BLOB_URL = 'https://jsonblob.com/api/jsonBlob/019aed29-e2e2-7591-aaf4-22c0d0931ee4';

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
    const res = await fetch(BLOB_URL, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch DB');
    const data = await res.json();
    console.log('DB Read Success. Keys:', Object.keys(data), 'Recipe Count:', data.recipes?.length);
    if (data.activeId === undefined && data.nextId === undefined) {
      console.warn('DB missing nextId/activeId, initializing...');
      // Auto-repair if needed in memory to prevent crashes, though writeDatabase needs to save it.
      if (!data.recipes) data.recipes = [];
      if (!data.nextId) {
        const maxId = data.recipes.reduce((max: number, r: any) => Math.max(max, r.id || 0), 0);
        data.nextId = maxId + 1;
      }
    }
    return data;
  } catch (error) {
    console.error('DB Read Error:', error);
    return { recipes: [], nextId: 1 };
  }
}

async function writeDatabase(db: Database): Promise<void> {
  await fetch(BLOB_URL, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(db),
  });
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
  console.log(`Updating recipe id: ${id}. Found index: ${index}`);

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
