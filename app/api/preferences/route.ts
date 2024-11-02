import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { connectToDatabase } from '@/app/utils/dbConnect';
import { getUserPreferencesCollection } from '../../../models/userPreferences';
import { authOptions } from '@/lib/auth';
import { IUserPreferences, IPreference } from '../../../models/userPreferences';

export async function GET() {
  try {
    const db = await connectToDatabase();
    const userPreferencesCollection = await getUserPreferencesCollection(db);

    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
    }

    const userEmail = session.user.email;

    // Fetch user's preferences from the collection
    const userPreferences = await userPreferencesCollection.findOne({ userEmail });

    if (!userPreferences) {
      return NextResponse.json({ preferences: null, message: 'No preferences found for the user.' }, { status: 200 });
    }

    return NextResponse.json({ preferences: userPreferences }, { status: 200 });
  } catch (error) {
    console.error('Error fetching preferences:', error);

    let errorMessage = 'An unknown error occurred';
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json(
      { error: 'Failed to fetch preferences', details: errorMessage },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const db = await connectToDatabase();
    const userPreferencesCollection = await getUserPreferencesCollection(db);

    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
    }

    const userEmail = session.user.email;
    const body = await request.json();

    // Extract preferences data from the body and assign default values to ensure compatibility with IUserPreferences
    const updatedPreferences: IUserPreferences = {
      userEmail,
      cuisinePreferences: body.cuisinePreferences ?? [],
      dietaryPreferences: body.dietaryPreferences ?? [],
      cookingDifficultyPreferences: body.cookingDifficultyPreferences ?? [],
      interactionPreferences: body.interactionPreferences ?? [],
      dietaryRestrictions: body.dietaryRestrictions ?? [],
      mealPlanning: body.mealPlanning ?? '',
      diets: body.diets ?? '',
      familyConsiderations: body.familyConsiderations ?? '',
      cookingMethods: body.cookingMethods ?? [],
      wholeFood: body.wholeFood ?? '',
      seasonality: body.seasonality ?? '',
      userGoals: body.userGoals ?? '',
      wellnessImportance: body.wellnessImportance ?? 0,
      interactionImportance: body.interactionImportance ?? 0,
      experienceMapping: body.experienceMapping ?? [],
      generalPreferencesNotes: body.generalPreferencesNotes ?? '',
      mealPlanningNotes: body.mealPlanningNotes ?? '',
      cookingPreferencesNotes: body.cookingPreferencesNotes ?? '',
      wellnessNotes: body.wellnessNotes ?? '',
      experienceMappingNotes: body.experienceMappingNotes ?? '',
    };

    // Check if user preferences already exist
    const existingPreferences = await userPreferencesCollection.findOne({ userEmail });

    if (existingPreferences) {
      // Update the existing preferences
      await userPreferencesCollection.updateOne(
        { userEmail },
        { $set: updatedPreferences }
      );
    } else {
      // Insert new preferences if not present
      await userPreferencesCollection.insertOne(updatedPreferences);
    }

    return NextResponse.json({ message: 'Preferences saved successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error saving preferences:', error);

    let errorMessage = 'An unknown error occurred';
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json(
      { error: 'Failed to save preferences', details: errorMessage },
      { status: 500 }
    );
  }
}
