import { NextRequest, NextResponse } from 'next/server';
import { getAllRecipes, createRecipe } from '@/lib/db';
import { writeFile } from 'fs/promises';
import path from 'path';

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
        const formData = await request.formData();

        const title = formData.get('title') as string;
        const author = formData.get('author') as string;
        const description = formData.get('description') as string;
        const ingredients = formData.get('ingredients') as string;
        const instructions = formData.get('instructions') as string;
        const imageFile = formData.get('image') as File;

        let imageUrl = '';

        if (imageFile && imageFile.size > 0) {
            const bytes = await imageFile.arrayBuffer();
            const buffer = Buffer.from(bytes);

            const filename = `${Date.now()}-${imageFile.name}`;
            const filepath = path.join(process.cwd(), 'public', 'uploads', filename);

            await writeFile(filepath, buffer);
            imageUrl = `/uploads/${filename}`;
        }

        const recipe = await createRecipe({
            title,
            author,
            description,
            ingredients,
            instructions,
            imageUrl
        });

        return NextResponse.json(recipe, { status: 201 });
    } catch (error) {
        console.error('Error creating recipe:', error);
        return NextResponse.json({ error: 'Failed to create recipe' }, { status: 500 });
    }
}
