import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getAllRecipes, createRecipe } from '@/lib/db';

export async function GET() {
    try {
        const recipes = await getAllRecipes();
        return NextResponse.json(recipes);
    } catch (error) {
        console.error('Error fetching recipes:', error);
        return NextResponse.json({ error: 'Failed to fetch recipes' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { title, author, description, ingredients, instructions, imageUrl } = body;

        const recipe = await createRecipe({
            title,
            author,
            description,
            ingredients,
            instructions,
            imageUrl
        });

        revalidatePath('/');
        return NextResponse.json(recipe, { status: 201 });
    } catch (error) {
        console.error('Error creating recipe:', error);
        return NextResponse.json({ error: 'Failed to create recipe' }, { status: 500 });
    }
}
