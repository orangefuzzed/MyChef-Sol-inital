import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/app/utils/dbConnect';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

// NEW COLLECTION: dishcoveryCategories
const COLLECTION_NAME = 'dishcoveryCategories';

// Updated app/api/recipes/categories/route.ts

export async function GET(request: Request) {
  try {
    const db = await connectToDatabase();
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
    }

    const userEmail = session.user.email;
    const { searchParams } = new URL(request.url);
    const mainCategory = searchParams.get('mainCategory');

    const collection = db.collection(COLLECTION_NAME);

    let query: any = { userEmail };

    // If a mainCategory is provided, filter by it
    if (mainCategory) {
      query.mainCategory = mainCategory;
    }

    const recipes = await collection.find(query).toArray();

    return NextResponse.json(recipes);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}


// Save a recipe to a category
export async function POST(request: Request) {
  try {
    const db = await connectToDatabase();
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
    }

    const userEmail = session.user.email;
    const { recipeId, mainCategory, subCategory } = await request.json();

    if (!recipeId || !mainCategory) {
      return NextResponse.json(
        { error: 'Recipe ID and Main Category are required' },
        { status: 400 }
      );
    }

    const collection = db.collection(COLLECTION_NAME);

    // Prepare the category document
    const categoryDocument = {
      recipeId,
      userEmail,
      mainCategory,
      subCategory: subCategory || null, // Optional subcategory
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Upsert the document (create or update)
    const result = await collection.updateOne(
      { recipeId, userEmail }, // Match by recipeId and user
      { $set: categoryDocument }, // Update or insert
      { upsert: true }
    );

    if (result.upsertedCount > 0) {
      console.log(`New category created for recipe ${recipeId}`);
    } else if (result.modifiedCount > 0) {
      console.log(`Category updated for recipe ${recipeId}`);
    } else {
      console.warn(`No changes made for recipe ${recipeId}`);
    }

    return NextResponse.json({ message: 'Recipe categorized successfully' });
  } catch (error) {
    console.error('Error categorizing recipe:', error);
    return NextResponse.json({ error: 'Failed to save category' }, { status: 500 });
  }
}


// Remove a recipe from a category
export async function DELETE(request: Request) {
  try {
    const db = await connectToDatabase();
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
    }

    const userEmail = session.user.email;
    const { searchParams } = new URL(request.url);
    const recipeId = searchParams.get('recipeId');

    if (!recipeId) {
      return NextResponse.json({ error: 'Recipe ID is required' }, { status: 400 });
    }

    const collection = db.collection(COLLECTION_NAME);

    // Attempt to delete the document
    const result = await collection.deleteOne({ recipeId, userEmail });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Category not found for the given recipe ID' }, { status: 404 });
    }

    console.log(`Category successfully removed for recipe ${recipeId}`);
    return NextResponse.json({ message: 'Recipe removed from category successfully' });
  } catch (error) {
    console.error('Error removing category:', error);
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
  }
}

