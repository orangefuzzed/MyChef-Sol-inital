// Updated app/api/account/route.ts

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { connectToDatabase } from '@/app/utils/dbConnect';
import { getAccountsCollection, IAccount } from '@/models/account';
import cloudinary from 'cloudinary';
import bcrypt from 'bcryptjs';
import { Readable } from 'stream';


cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// GET handler to fetch user account data
export async function GET() {
  try {
    const db = await connectToDatabase();
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
    }

    const userEmail = session.user.email;
    const accountsCollection = await getAccountsCollection(db);
    const accountData = await accountsCollection.findOne<IAccount>({ userEmail });

    if (!accountData) {
      return NextResponse.json({ error: 'Account not found' }, { status: 404 });
    }

    return NextResponse.json({ account: accountData }, { status: 200 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error fetching account data:', error.message);
      return NextResponse.json(
        { error: 'Failed to fetch account data', details: error.message },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: 'An unknown error occurred' },
      { status: 500 }
    );
  }
}

// POST handler to update user account data
export async function POST(request: Request) {
  try {
    const db = await connectToDatabase();
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
    }

    const userEmail = session.user.email;
    const body = await request.formData();
    const updatedData = JSON.parse(body.get('data') as string);

    // Handle the avatar file if available
    const avatarFile = body.get('avatar') as File | null;
    const accountsCollection = await getAccountsCollection(db);

    // Find the user's account by userEmail
    let accountData = await accountsCollection.findOne<IAccount>({ userEmail });

    if (!accountData) {
      // Create a new account document if none exists
      await accountsCollection.insertOne({ userEmail, ...updatedData });
      accountData = await accountsCollection.findOne<IAccount>({ userEmail }); // Re-fetch after inserting
    } else {
      // Update the existing account document
      await accountsCollection.updateOne({ userEmail }, { $set: updatedData });
    }

    // Handle avatar upload to Cloudinary
    if (avatarFile) {
      try {
        const buffer = await avatarFile.arrayBuffer(); // Convert the file to an ArrayBuffer
        const readableStream = Readable.from(Buffer.from(buffer)); // Create a readable stream from the buffer

        await new Promise<void>((resolve, reject) => {
          const cloudinaryUpload = cloudinary.v2.uploader.upload_stream(
            {
              folder: 'avatars',
              public_id: `avatar_${userEmail}`,
              overwrite: true,
            },
            (error, result) => {
              if (error) {
                return reject(error);
              }
              if (result) {
                accountData!.avatarUrl = result.secure_url; // Save Cloudinary URL to the account data
                resolve();
              }
            }
          );
          readableStream.pipe(cloudinaryUpload);
        });

        // Update avatar URL in MongoDB
        await accountsCollection.updateOne({ userEmail }, { $set: { avatarUrl: accountData!.avatarUrl } });
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error('Error fetching account data:', error.message);
          return NextResponse.json(
            { error: 'Failed to fetch account data', details: error.message },
            { status: 500 }
          );
        }
        return NextResponse.json(
          { error: 'An unknown error occurred' },
          { status: 500 }
        );
      }
    }

    // Handle password update (hashed) in 'users' collection
    if (updatedData.password) {
      const authUser = await db.collection('users').findOne({ email: userEmail });

      if (authUser) {
        const hashedPassword = await bcrypt.hash(updatedData.password, 10);
        await db.collection('users').updateOne(
          { email: userEmail },
          { $set: { password: hashedPassword } }
        );
      }
    }

    return NextResponse.json({ message: 'Account information saved successfully' }, { status: 200 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error fetching account data:', error.message);
      return NextResponse.json(
        { error: 'Failed to fetch account data', details: error.message },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: 'An unknown error occurred' },
      { status: 500 }
    );
  }
}
