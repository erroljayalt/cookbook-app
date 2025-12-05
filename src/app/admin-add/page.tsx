'use client';

import { useState, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

interface Recipe {
    id: number;
    title: string;
    author: string;
    description: string;
    ingredients: string;
    instructions: string;
    imageUrl: string;
}

export default function AdminPage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [editingId, setEditingId] = useState<number | null>(null);

    // Form State
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [description, setDescription] = useState('');
    const [ingredients, setIngredients] = useState(['']);
    const [instructions, setInstructions] = useState(['']);

    useEffect(() => {
        fetchRecipes();
    }, []);

    const fetchRecipes = async () => {
        try {
            const res = await fetch('/api/recipes');
            if (res.ok) {
                const data = await res.json();
                setRecipes(data);
            }
        } catch (error) {
            console.error('Error fetching recipes:', error);
        }
    };

    const resetForm = () => {
        setEditingId(null);
        setTitle('');
        setAuthor('');
        setDescription('');
        setIngredients(['']);
        setInstructions(['']);
    };

    const handleEdit = (recipe: Recipe) => {
        setEditingId(recipe.id);
        setTitle(recipe.title);
        setAuthor(recipe.author);
        setDescription(recipe.description);
        setIngredients(JSON.parse(recipe.ingredients));
        setInstructions(JSON.parse(recipe.instructions));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this recipe?')) return;

        try {
            const res = await fetch(`/api/recipes/${id}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                fetchRecipes();
                if (editingId === id) resetForm();
            } else {
                alert('Failed to delete recipe');
            }
        } catch (error) {
            console.error('Error deleting recipe:', error);
            alert('Error deleting recipe');
        }
    };

    const addIngredient = () => setIngredients([...ingredients, '']);
    const removeIngredient = (index: number) => setIngredients(ingredients.filter((_, i) => i !== index));
    const updateIngredient = (index: number, value: string) => {
        const newIngredients = [...ingredients];
        newIngredients[index] = value;
        setIngredients(newIngredients);
    };

    const addInstruction = () => setInstructions([...instructions, '']);
    const removeInstruction = (index: number) => setInstructions(instructions.filter((_, i) => i !== index));
    const updateInstruction = (index: number, value: string) => {
        const newInstructions = [...instructions];
        newInstructions[index] = value;
        setInstructions(newInstructions);
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        const filteredIngredients = ingredients.filter(i => i.trim() !== '');
        const filteredInstructions = instructions.filter(i => i.trim() !== '');

        // For file upload, we still need FormData, but for update we might send JSON if no image change
        // To keep it simple, we'll use FormData for both, but handle the API difference

        const formData = new FormData(e.currentTarget);
        formData.set('ingredients', JSON.stringify(filteredIngredients));
        formData.set('instructions', JSON.stringify(filteredInstructions));

        try {
            let response;
            if (editingId) {
                // Update Mode (PUT) - Note: File upload with PUT might need special handling or just JSON
                // For simplicity in this demo, we'll send JSON for updates and ignore image updates for now
                // or we can stick to one pattern. Let's try sending JSON for update.
                const updateData = {
                    title,
                    author,
                    description,
                    ingredients: JSON.stringify(filteredIngredients),
                    instructions: JSON.stringify(filteredInstructions),
                };

                response = await fetch(`/api/recipes/${editingId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(updateData),
                });
            } else {
                // Create Mode (POST)
                response = await fetch('/api/recipes', {
                    method: 'POST',
                    body: formData,
                });
            }

            if (response.ok) {
                fetchRecipes();
                resetForm();
                alert(editingId ? 'Recipe updated!' : 'Recipe created!');
            } else {
                alert('Failed to save recipe.');
            }
        } catch (error) {
            console.error('Error saving recipe:', error);
            alert('An error occurred.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container">
            <div className={styles.uploadHeader}>
                <h1>Recipe Management</h1>
                <p>Add, edit, or remove recipes</p>
            </div>

            <div className={styles.adminLayout}>
                <div className={styles.formContainer}>
                    <h2>{editingId ? 'Edit Recipe' : 'Add New Recipe'}</h2>
                    <form onSubmit={handleSubmit} className={styles.uploadForm}>
                        <div className={styles.formSection}>
                            <div className={styles.formGroup}>
                                <label htmlFor="title">Recipe Title *</label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    value={title}
                                    onChange={e => setTitle(e.target.value)}
                                    required
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="author">Chef&apos;s Name *</label>
                                <input
                                    type="text"
                                    id="author"
                                    name="author"
                                    value={author}
                                    onChange={e => setAuthor(e.target.value)}
                                    required
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="description">Description</label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={description}
                                    onChange={e => setDescription(e.target.value)}
                                    rows={3}
                                />
                            </div>

                            {!editingId && (
                                <div className={styles.formGroup}>
                                    <label htmlFor="image">Recipe Image</label>
                                    <input
                                        type="file"
                                        id="image"
                                        name="image"
                                        accept="image/*"
                                        className={styles.fileInput}
                                    />
                                </div>
                            )}
                        </div>

                        <div className={styles.formSection}>
                            <h3>Ingredients</h3>
                            {ingredients.map((ingredient, index) => (
                                <div key={index} className={styles.dynamicField}>
                                    <input
                                        type="text"
                                        value={ingredient}
                                        onChange={(e) => updateIngredient(index, e.target.value)}
                                        placeholder={`Ingredient ${index + 1}`}
                                    />
                                    <button type="button" onClick={() => removeIngredient(index)} className={styles.removeBtn}>✕</button>
                                </div>
                            ))}
                            <button type="button" onClick={addIngredient} className="btn btn-secondary">+ Add Ingredient</button>
                        </div>

                        <div className={styles.formSection}>
                            <h3>Instructions</h3>
                            {instructions.map((instruction, index) => (
                                <div key={index} className={styles.dynamicField}>
                                    <textarea
                                        value={instruction}
                                        onChange={(e) => updateInstruction(index, e.target.value)}
                                        placeholder={`Step ${index + 1}`}
                                        rows={2}
                                    />
                                    <button type="button" onClick={() => removeInstruction(index)} className={styles.removeBtn}>✕</button>
                                </div>
                            ))}
                            <button type="button" onClick={addInstruction} className="btn btn-secondary">+ Add Step</button>
                        </div>

                        <div className={styles.formActions}>
                            {editingId && (
                                <button type="button" onClick={resetForm} className="btn btn-secondary">
                                    Cancel
                                </button>
                            )}
                            <button type="submit" disabled={isSubmitting} className="btn btn-primary">
                                {isSubmitting ? 'Saving...' : (editingId ? 'Update Recipe' : 'Publish Recipe')}
                            </button>
                        </div>
                    </form>
                </div>

                <div className={styles.listContainer}>
                    <h2>Existing Recipes</h2>
                    <div className={styles.recipeList}>
                        {recipes.map(recipe => (
                            <div key={recipe.id} className={styles.recipeItem}>
                                <div className={styles.recipeInfo}>
                                    <h3>{recipe.title}</h3>
                                    <p>by {recipe.author}</p>
                                </div>
                                <div className={styles.recipeActions}>
                                    <button onClick={() => handleEdit(recipe)} className={styles.editBtn}>Edit</button>
                                    <button onClick={() => handleDelete(recipe.id)} className={styles.deleteBtn}>Delete</button>
                                </div>
                            </div>
                        ))}
                        {recipes.length === 0 && <p>No recipes found.</p>}
                    </div>
                </div>
            </div>
        </div>
    );
}
