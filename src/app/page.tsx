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
        <div className={styles.container}>
            {/* Hero Section */}
            <section className={styles.hero}>
                <p className={styles.heroPretitle}>Welcome to</p>
                <h1 className={styles.heroTitle}>Flavorful Forums</h1>
                <p className={styles.heroSubtitle}>A Digital Cookbook</p>
                <p className={styles.heroDescription}>Discover and share amazing recipes from around the world</p>
                <Link href="#recipes" className={styles.heroButton}>See The Menu</Link>
            </section>

            {/* Recipe Grid */}
            <section id="recipes" className={styles.recipeSection}>
                <div className={styles.sectionHeader}>
                    <h2>What&apos;s on our plate?</h2>
                </div>

                {recipes.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '2rem' }}>
                        <p>No recipes yet. Be the first to add one!</p>
                    </div>
                ) : (
                    <div className={styles.recipeGrid}>
                        {recipes.map((recipe) => (
                            <Link href={`/recipes/${recipe.id}`} key={recipe.id} className={styles.recipeCard}>
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
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: '3rem' }}>
                                            🍽️
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
                )}
            </section>

            <div className={styles.footerBanner}>
                <img src="/footer-banner.png" alt="Team Banner" className={styles.bannerImage} />
            </div>
        </div>
    );
}
