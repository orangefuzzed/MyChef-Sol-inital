import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/app/utils/dbConnect';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const email = searchParams.get('email');

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        const db = await connectToDatabase();
        const user = await db.collection('users').findOne({ email });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        if (!user.passwordHint) {
            return NextResponse.json({ error: 'No password hint found' }, { status: 404 });
        }

        return NextResponse.json({ passwordHint: user.passwordHint }, { status: 200 });
    } catch (error) {
        console.error('Error fetching password hint:', error);
        return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
    }
}
