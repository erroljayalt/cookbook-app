import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import styles from './page.module.css';

export const dynamic = 'force-dynamic';

interface Recipe {
    id: number;
    title: string;
    author: string;
    description: string;
    ingredients: string;
    instructions: string;
    imageUrl: string;
    chibiUrl?: string;
    servingSuggestions?: string;
}

import { getRecipeById, getAllRecipes } from '@/lib/db';
import RecipeNavigation from './RecipeNavigation';

async function getRecipe(id: string): Promise<Recipe | null> {
    try {
        const recipeId = parseInt(id);
        const recipe = await getRecipeById(recipeId);
        return recipe || null;
    } catch (error) {
        console.error('Error fetching recipe:', error);
        return null;
    }
}

export default async function RecipePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const recipe = await getRecipe(id);
    const allRecipes = await getAllRecipes();

    if (!recipe) {
        notFound();
    }

    const currentIndex = allRecipes.findIndex(r => r.id === recipe.id);
    const prevIndex = (currentIndex - 1 + allRecipes.length) % allRecipes.length;
    const nextIndex = (currentIndex + 1) % allRecipes.length;

    const prevId = allRecipes[prevIndex].id;
    const nextId = allRecipes[nextIndex].id;

    const ingredients = JSON.parse(recipe.ingredients);
    const instructions = JSON.parse(recipe.instructions);

    return (
        <div className="container">
            <RecipeNavigation prevId={prevId} nextId={nextId} />
            <Link href="/" className={styles.backLink}>
                ← Back to Recipes
            </Link>

            <article className={styles.recipeDetail}>
                <div className={styles.heroSection}>
                    {recipe.imageUrl ? (
                        <div className={styles.heroImageWrapper}>
                            <Image
                                src={recipe.imageUrl}
                                alt={recipe.title}
                                fill
                                className={styles.heroImage}
                                priority
                                sizes="100vw"
                            />
                        </div>
                    ) : (
                        <div className={styles.heroPlaceholder}>
                            <span>🍽️</span>
                        </div>
                    )}
                    <div className={styles.heroOverlay}>
                        <h1 className={styles.recipeTitle}>{recipe.title}</h1>
                        <p className={styles.recipeAuthor}>{recipe.author}</p>
                    </div>
                </div>

                {recipe.description && (
                    <div className={styles.description}>
                        <p>{recipe.description}</p>
                    </div>
                )}

                <div className={styles.contentGrid}>
                    <div className={styles.ingredientsSection}>
                        <h2>Ingredients:</h2>
                        <ul className={styles.ingredientsList}>
                            {ingredients.map((ingredient: string, index: number) => (
                                <li key={index}>{ingredient}</li>
                            ))}
                        </ul>
                    </div>

                    <div className={styles.instructionsSection}>
                        <h2>Cooking Instructions:</h2>
                        <ol className={styles.instructionsList}>
                            {instructions.map((instruction: string, index: number) => (
                                <li key={index}>{instruction}</li>
                            ))}
                        </ol>

                        {recipe.servingSuggestions && (
                            <div className={styles.servingSection}>
                                <h2>Serving Suggestions:</h2>
                                <p>{recipe.servingSuggestions}</p>
                            </div>
                        )}
                        {recipe.chibiUrl && (
                            <div className={styles.chibiContainer}>
                                <img src={recipe.chibiUrl} alt="Chibi Decoration" className={styles.chibiImage} />
                            </div>
                        )}
                    </div>
                </div>
            </article>
        </div>
    );
}
