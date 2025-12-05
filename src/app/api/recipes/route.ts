import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getAllRecipes, createRecipe } from '@/lib/db';
import { writeFile, mkdir } from 'fs/promises';
import { promises as fs } from 'fs';
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
            // Use /tmp for uploads
            const uploadDir = path.join('/tmp', 'uploads');
            try {
                await fs.mkdir(uploadDir, { recursive: true });
            } catch (e) {
                // Ignore if exists
            }

            const filepath = path.join(uploadDir, filename);

            await writeFile(filepath, buffer);
            // We'll need a way to serve this, for now let's point to a new API route
            imageUrl = `/api/uploads/${filename}`;
        }

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
