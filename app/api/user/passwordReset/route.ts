import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/app/utils/dbConnect';
import bcrypt from 'bcryptjs';

/**
 * POST /api/user/passwordReset
 * Expects { email, newPassword, passwordHint } in JSON body.
 * Must only succeed if userDoc.passwordReset === true
 */
export async function POST(request: Request) {
    try {
        // 1. Parse body
        const { email, newPassword, passwordHint } = await request.json();

        // 2. Validate presence
        if (!email || !newPassword || !passwordHint) {
            return NextResponse.json(
                { error: 'Missing email, newPassword, or passwordHint' },
                { status: 400 }
            );
        }

        const db = await connectToDatabase();
        const usersCol = db.collection('users');
        const accountsCol = db.collection('accounts');
        // ^ or whatever your second collection is named

        // 3. Find user doc
        const userDoc = await usersCol.findOne({ email });
        if (!userDoc) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // 4. Must have passwordReset === true
        if (!userDoc.passwordReset) {
            return NextResponse.json(
                { error: 'Password reset not allowed; userDoc.passwordReset is not true' },
                { status: 403 }
            );
        }

        // 5. Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // 6. Update user doc in `users`
        await usersCol.updateOne(
            { email },
            {
                $set: {
                    password: hashedPassword,
                    passwordHint,
                    hasCreatedAccount: true,
                    passwordReset: false,
                    updatedAt: new Date(),
                },
                $setOnInsert: { createdAt: new Date() },
            },
            { upsert: false }
        );

        // 7. Also update the `accounts` collection if that doc exists
        const accountDoc = await accountsCol.findOne({ userEmail: email });

        if (accountDoc) {
            await accountsCol.updateOne(
                { userEmail: email },
                { $set: { passwordHint, updatedAt: new Date() } }
            );
        }
        // If you want to create a doc if none exists, you'd do upsert: true or something similar

        return NextResponse.json({ success: true, message: 'Password reset successfully' });
    } catch (error) {
        console.error('Error resetting password:', error);
        return NextResponse.json(
            { error: 'Failed to reset password', details: String(error) },
            { status: 500 }
        );
    }
}
