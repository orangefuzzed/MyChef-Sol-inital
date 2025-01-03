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
    return NextResponse.json({ preferences: userPreferences || {} }, { status: 200 });
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
      adventureScale: body.adventureScale || 2,
      dietaryRestrictions: body.dietaryRestrictions || [],
      cookingStyle: body.cookingStyle || [],
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
