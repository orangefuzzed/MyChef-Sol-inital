import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/app/utils/dbConnect';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

// Handle GET request: Fetch onboarding status
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
    }

    const userEmail = session.user.email;
    const db = await connectToDatabase();
    const collection = db.collection('users');

    // Fetch the user's onboarding status
    const user = await collection.findOne({ email: userEmail });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const hasSeenOnboarding = user.hasSeenOnboarding ?? false; // Default to false if undefined
    return NextResponse.json({ hasSeenOnboarding });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error fetching onboarding status:', error.message);
      return NextResponse.json({ error: 'Failed to fetch onboarding status', details: error.message }, { status: 500 });
    } else {
      console.error('An unexpected error occurred');
      return NextResponse.json({ error: 'Failed to fetch onboarding status', details: 'An unexpected error occurred' }, { status: 500 });
    }
  }
}

// Handle POST request: Update onboarding status
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
    }

    const userEmail = session.user.email;
    const db = await connectToDatabase();
    const collection = db.collection('users');

    const { hasSeenOnboarding } = await request.json();

    if (typeof hasSeenOnboarding !== 'boolean') {
      return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
    }

    // Update the user's onboarding status
    const result = await collection.updateOne(
      { email: userEmail },
      { $set: { hasSeenOnboarding } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (result.modifiedCount === 0) {
      return NextResponse.json({ error: 'Failed to update onboarding status' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Onboarding status updated successfully' });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error updating onboarding status:', error.message);
      return NextResponse.json({ error: 'Failed to update onboarding status', details: error.message }, { status: 500 });
    } else {
      console.error('An unexpected error occurred');
      return NextResponse.json({ error: 'Failed to update onboarding status', details: 'An unexpected error occurred' }, { status: 500 });
    }
  }
}
