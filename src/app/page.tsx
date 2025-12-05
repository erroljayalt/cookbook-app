import Link from 'next/link';
import Image from 'next/image';
import styles from './page.module.css';

export const dynamic = 'force-dynamic';

interface Recipe {
    id: number;
    title: string;
    author: string;
    description: string;
    imageUrl: string;
}

import { getAllRecipes } from '@/lib/db';

async function getRecipes(): Promise<Recipe[]> {
    try {
        return await getAllRecipes();
    } catch (error) {
        console.error('Error fetching recipes:', error);
        return [];
    }
}

export default async function Home() {
    const recipes = await getRecipes();

    return (
        <div className="container">
            <div className={styles.hero}>
                <h1 className={styles.heroTitle}>Flavorful Forums</h1>
                <p className={styles.heroSubtitle}>A Digital Cookbook</p>
                <p className={styles.heroDescription}>
                    Discover and share amazing recipes from around the world
                </p>
            </div>

            {recipes.length === 0 ? (
                <div className={styles.emptyState}>
                    <h2>No Recipes Yet</h2>
                    <p>Be the first to add a recipe to our cookbook!</p>
                </div>
            ) : (
                <>
                    <div className={styles.sectionHeader}>
                        <h2>What&apos;s on our plate?</h2>
                    </div>
                    <div className={styles.recipeGrid}>
                        {recipes.map((recipe, index) => (
                            <Link
                                href={`/recipes/${recipe.id}`}
                                key={recipe.id}
                                className={`${styles.recipeCard} card fade-in`}
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <div className={styles.recipeImageWrapper}>
                                    {recipe.imageUrl ? (
                                        <Image
                                            src={recipe.imageUrl}
                                            alt={recipe.title}
                                            fill
                                            className={styles.recipeImage}
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        />
                                    ) : (
                                        <div className={styles.placeholderImage}>
                                            <span>🍽️</span>
                                        </div>
                                    )}
                                </div>
                                <div className={styles.recipeContent}>
                                    <h3 className={styles.recipeTitle}>{recipe.title}</h3>
                                    <p className={styles.recipeAuthor}>by {recipe.author}</p>
                                    {recipe.description && (
                                        <p className={styles.recipeDescription}>
                                            {recipe.description.substring(0, 100)}
                                            {recipe.description.length > 100 ? '...' : ''}
                                        </p>
                                    )}
                                </div>
                            </Link>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
