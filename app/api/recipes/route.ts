// app/api/recipes/route.ts

import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/app/utils/dbConnect';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { RecipeResponse } from '@/types/RecipeResponse';
import { insertRecipe } from '../../../models/recipe';

export async function GET(request: Request) {
  try {
    console.log('Connecting to database...');
    await connectToDatabase();
    console.log('Database connected successfully.');

    const session = await getServerSession(authOptions);
    console.log('Session:', session);

    if (!session?.user?.email) {
      console.error('User not authenticated');
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
    }

    const userEmail = session.user.email;
    const { recipe } = await request.json();

    console.log('Recipe data received:', recipe);

    // Add userEmail to the recipe data
    const recipeData = { ...recipe, userEmail };

    // Save the recipe to the database
    await insertRecipe(recipeData); // Use the insertRecipe function instead

    console.log('Recipe saved successfully.');

    const savedRecipe: RecipeResponse = {
      id: recipeData._id?.toString(),
      title: recipeData.recipeTitle,
      description: recipeData.description,
      ingredients: recipeData.ingredients,
      instructions: recipeData.instructions,
      imageURL: recipeData.imageURL,
      userEmail: recipeData.userEmail,
      createdAt: recipeData.createdAt,
      updatedAt: recipeData.updatedAt,
    };
    

    return NextResponse.json({ message: 'Recipe saved successfully', recipe: savedRecipe }, { status: 200 });
  } catch (error) {
    console.error('Error saving recipe:', error);
    return NextResponse.json(
      { error: 'Failed to save recipe', details: (error as Error).message },
      { status: 500 }
    );
  }
}


export async function POST(request: Request) {
  try {
    await connectToDatabase();

    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
    }

    const userEmail = session.user.email;
    const { recipe } = await request.json();

    // Add userEmail to the recipe data
    const recipeData = { ...recipe, userEmail };

    // Save the recipe to the database
    await insertRecipe(recipeData); // Use the insertRecipe function here too

    // Prepare the response recipe with 'id'
    const savedRecipe: RecipeResponse = {
      id: recipeData._id?.toString(), // Use the inserted data directly
      title: recipeData.recipeTitle,
      description: recipeData.description,
      ingredients: recipeData.ingredients,
      instructions: recipeData.instructions,
      imageURL: recipeData.imageURL,
      userEmail: recipeData.userEmail,
      createdAt: recipeData.createdAt,
      updatedAt: recipeData.updatedAt,
    };    

    return NextResponse.json({ message: 'Recipe saved successfully', recipe: savedRecipe }, { status: 200 });
  } catch (error) {
    console.error('Error saving recipe:', error);
    return NextResponse.json({ error: 'Failed to save recipe' }, { status: 500 });
  }
}

