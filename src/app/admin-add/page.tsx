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
    chibiUrl?: string;
    servingSuggestions?: string;
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
    const [servingSuggestions, setServingSuggestions] = useState('');
    const [ingredients, setIngredients] = useState(['']);
    const [instructions, setInstructions] = useState(['']);
    const [imagePreview, setImagePreview] = useState<string>('');
    const [imageUrl, setImageUrl] = useState<string>('');
    const [chibiPreview, setChibiPreview] = useState<string>('');
    const [chibiUrl, setChibiUrl] = useState<string>('');

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
        setServingSuggestions('');
        setIngredients(['']);
        setInstructions(['']);
        setImagePreview('');
        setImageUrl('');
        setChibiPreview('');
        setChibiUrl('');
    };

    const handleEdit = (recipe: Recipe) => {
        setEditingId(recipe.id);
        setTitle(recipe.title);
        setAuthor(recipe.author);
        setDescription(recipe.description);
        setServingSuggestions(recipe.servingSuggestions || '');
        setIngredients(JSON.parse(recipe.ingredients));
        setInstructions(JSON.parse(recipe.instructions));
        setImageUrl(recipe.imageUrl || '');
        setImagePreview(recipe.imageUrl || '');
        setChibiUrl(recipe.chibiUrl || '');
        setChibiPreview(recipe.chibiUrl || '');
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

    const convertToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    const MAX_WIDTH = 800;
                    const MAX_HEIGHT = 600;
                    let width = img.width;
                    let height = img.height;

                    if (width > height) {
                        if (width > MAX_WIDTH) {
                            height *= MAX_WIDTH / width;
                            width = MAX_WIDTH;
                        }
                    } else {
                        if (height > MAX_HEIGHT) {
                            width *= MAX_HEIGHT / height;
                            height = MAX_HEIGHT;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;
                    ctx?.drawImage(img, 0, 0, width, height);
                    resolve(canvas.toDataURL('image/jpeg', 0.7));
                };
                img.src = e.target?.result as string;
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            try {
                const base64 = await convertToBase64(file);
                setImagePreview(base64);
                setImageUrl(base64);
            } catch (error) {
                console.error('Error processing image:', error);
                alert('Failed to process image');
            }
        }
    };

    const handleChibiChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            try {
                const base64 = await convertToBase64(file);
                setChibiPreview(base64);
                setChibiUrl(base64);
            } catch (error) {
                console.error('Error processing chibi image:', error);
                alert('Failed to process chibi image');
            }
        }
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        const filteredIngredients = ingredients.filter(i => i.trim() !== '');
        const filteredInstructions = instructions.filter(i => i.trim() !== '');

        const recipeData = {
            title,
            author,
            description,
            servingSuggestions,
            ingredients: JSON.stringify(filteredIngredients),
            instructions: JSON.stringify(filteredInstructions),
            imageUrl,
            chibiUrl,
        };

        try {
            let response;
            if (editingId) {
                response = await fetch(`/api/recipes/${editingId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(recipeData),
                });
            } else {
                response = await fetch('/api/recipes', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(recipeData),
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

                            <div className={styles.formGroup}>
                                <label htmlFor="servingSuggestions">Serving Suggestions</label>
                                <textarea
                                    id="servingSuggestions"
                                    name="servingSuggestions"
                                    value={servingSuggestions}
                                    onChange={e => setServingSuggestions(e.target.value)}
                                    rows={3}
                                    placeholder="e.g. Best served warm with a side of steamed rice..."
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="image">Recipe Image</label>
                                {imagePreview && (
                                    <div className={styles.imagePreview}>
                                        <img src={imagePreview} alt="Preview" style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '8px', marginBottom: '10px' }} />
                                    </div>
                                )}
                                <input
                                    type="file"
                                    id="image"
                                    name="image"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className={styles.fileInput}
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="chibi">Chibi Decoration Image (Optional)</label>
                                {chibiPreview && (
                                    <div className={styles.imagePreview}>
                                        <img src={chibiPreview} alt="Preview" style={{ maxWidth: '100px', maxHeight: '100px', borderRadius: '8px', marginBottom: '10px' }} />
                                    </div>
                                )}
                                <input
                                    type="file"
                                    id="chibi"
                                    name="chibi"
                                    accept="image/*"
                                    onChange={handleChibiChange}
                                    className={styles.fileInput}
                                />
                            </div>
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
