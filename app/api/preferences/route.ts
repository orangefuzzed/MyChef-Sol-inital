import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { connectToDatabase } from '@/app/utils/dbConnect';
import { getUserPreferencesCollection } from '../../../models/userPreferences';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    const db = await connectToDatabase();
    const userPreferencesCollection = await getUserPreferencesCollection(db);

    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
    }

    const userPreferences = await userPreferencesCollection.findOne({ userEmail: session.user.email });

    // Ensure all preference fields are returned, even if they are undefined in the database
    const defaultPreferences = {
      dietaryRestrictions: [],
      cookingStyle: [],
      ingredients: [], // New field
      schedule: [], // New field
    };

    return NextResponse.json({ preferences: { ...defaultPreferences, ...userPreferences } }, { status: 200 });
  } catch (error) {
    console.error('Error fetching preferences:', error);
    return NextResponse.json({ error: 'Failed to fetch preferences' }, { status: 500 });
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

    const body = await request.json();
    const userEmail = session.user.email;

    const updatedPreferences = {
      userEmail,
      dietaryRestrictions: body.dietaryRestrictions || [], // Full dynamic list support
      cookingStyle: body.cookingStyle || [],
      ingredients: body.ingredients || [], // New field
      schedule: body.schedule || [], // New field
    };

    await userPreferencesCollection.updateOne(
      { userEmail },
      { $set: updatedPreferences },
      { upsert: true }
    );

    return NextResponse.json({ message: 'Preferences saved successfully!' }, { status: 200 });
  } catch (error) {
    console.error('Error saving preferences:', error);
    return NextResponse.json({ error: 'Failed to save preferences' }, { status: 500 });
  }
}

