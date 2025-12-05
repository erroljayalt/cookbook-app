import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getRecipeById, updateRecipe, deleteRecipe } from '@/lib/db';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: idString } = await params;
        const id = parseInt(idString);
        const recipe = await getRecipeById(id);

        if (!recipe) {
            return NextResponse.json({ error: 'Recipe not found' }, { status: 404 });
        }

        return NextResponse.json(recipe);
    } catch (error) {
        console.error('Error fetching recipe:', error);
        return NextResponse.json({ error: 'Failed to fetch recipe' }, { status: 500 });
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: idString } = await params;
        const id = parseInt(idString);
        console.log(`API PUT /recipes/${id} called`);
        const updates = await request.json();

        const updatedRecipe = await updateRecipe(id, updates);

        if (!updatedRecipe) {
            return NextResponse.json({ error: 'Recipe not found' }, { status: 404 });
        }

        revalidatePath('/');
        return NextResponse.json(updatedRecipe);
    } catch (error) {
        console.error('Error updating recipe:', error);
        return NextResponse.json({ error: 'Failed to update recipe' }, { status: 500 });
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: idString } = await params;
        const id = parseInt(idString);

        const success = await deleteRecipe(id);

        if (!success) {
            return NextResponse.json({ error: 'Recipe not found' }, { status: 404 });
        }

        revalidatePath('/');
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting recipe:', error);
        return NextResponse.json({ error: 'Failed to delete recipe' }, { status: 500 });
    }
}
