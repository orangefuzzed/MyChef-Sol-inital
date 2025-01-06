import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/app/utils/dbConnect';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function GET() {
    try {
      const db = await connectToDatabase();
      const session = await getServerSession(authOptions);
  
      if (!session?.user?.email) {
        return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
      }
  
      const userEmail = session.user.email;
  
      const recipes = await db.collection('recipes').aggregate([
        { $match: { userEmail } }, // Filter recipes for the current user
        { $group: { _id: '$category', recipes: { $push: '$$ROOT' } } }, // Group by category
        { $sort: { _id: 1 } }, // Sort categories alphabetically
      ]).toArray();
  
      return NextResponse.json(recipes);
    } catch (error) {
      console.error('Error fetching recipes by category:', error);
      return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
    }
  }
  