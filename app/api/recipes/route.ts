import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/app/utils/dbConnect';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { RecipeResponse } from '@/types/RecipeResponse';
import { insertRecipe } from '../../../models/recipe';

// Helper function to get user session and validate it
const getSessionAndUser = async () => {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    throw new Error('User not authenticated');
  }
  return session.user.email;
};

// GET: Fetch saved recipes for the authenticated user
export async function GET() {
  try {
    console.log('Connecting to database...');
    const db = await connectToDatabase();
    console.log('Database connected successfully.');

    const userEmail = await getSessionAndUser();

    const collection = db.collection('recipes');
    const recipes = await collection.find({ userEmail }).toArray();
    
    console.log(`Fetched ${recipes.length} saved recipes for user: ${userEmail}`);
    
    // Transform MongoDB `_id` to `id` for response
    const savedRecipes: RecipeResponse[] = recipes.map((recipe) => ({
      id: recipe._id?.toString() || '',
      title: recipe.recipeTitle,
      description: recipe.description || '',
      ingredients: recipe.ingredients,
      instructions: recipe.instructions,
      imageURL: recipe.imageURL || '',
      userEmail: recipe.userEmail,
      createdAt: recipe.createdAt,
      updatedAt: recipe.updatedAt,
    }));

    return NextResponse.json({ recipes: savedRecipes }, { status: 200 });
  } catch (error) {
    console.error('Error fetching saved recipes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch saved recipes', details: (error as Error).message },
      { status: 500 }
    );
  }
}

// POST: Save a recipe for the authenticated user
export async function POST(request: Request) {
  try {
    const userEmail = await getSessionAndUser();

    const { recipe } = await request.json();
    console.log('Recipe data received:', recipe);

    const recipeData = { ...recipe, userEmail };
    await insertRecipe(recipeData);

    console.log('Recipe saved successfully.');

    // Prepare the response recipe with `id` included
    const savedRecipe: RecipeResponse = {
      id: recipeData._id?.toString() || '',
      title: recipeData.recipeTitle,
      description: recipeData.description || '',
      ingredients: recipeData.ingredients,
      instructions: recipeData.instructions,
      imageURL: recipeData.imageURL || '',
      userEmail: recipeData.userEmail,
      createdAt: recipeData.createdAt,
      updatedAt: recipeData.updatedAt,
    };

    return NextResponse.json({ message: 'Recipe saved successfully', recipe: savedRecipe }, { status: 200 });
  } catch (error) {
    console.error('Error saving recipe:', error);
    return NextResponse.json({ error: 'Failed to save recipe', details: (error as Error).message }, { status: 500 });
  }
}
