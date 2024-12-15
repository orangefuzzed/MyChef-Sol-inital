// app/api/account/route.ts

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

// GET handler: Fetch user account data
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

    console.error('Unknown error occurred');
    return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
  }
}

// POST handler: Update user account data
export async function POST(request: Request) {
  try {
    const db = await connectToDatabase();
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
    }

    const userEmail = session.user.email;
    
    // Parse form data
    const formData = await request.formData();
    const dataField = formData.get('data');
    if (!dataField || typeof dataField !== 'string') {
      return NextResponse.json({ error: 'Missing or invalid data field' }, { status: 400 });
    }

    const body = JSON.parse(dataField);
    const avatarFile = formData.get('avatar') as File | null;

    const updatedData = {
      displayName: body.displayName || '',
      linkedAccounts: body.linkedAccounts || { google: false, facebook: false },
      notificationSettings: body.notificationSettings || { emailNotifications: false, pushNotifications: false },
      privacySettings: body.privacySettings || { profileVisibility: 'public', dataCollectionOptIn: true },
      language: body.language || '',
      region: body.region || '',
      avatarUrl: body.avatarUrl || '',
    };

    const accountsCollection = await getAccountsCollection(db);
    const existingAccount = await accountsCollection.findOne<IAccount>({ userEmail });

    if (existingAccount) {
      await accountsCollection.updateOne({ userEmail }, { $set: updatedData });
    } else {
      await accountsCollection.insertOne({ userEmail, ...updatedData });
    }

    // Handle avatar upload if present
    if (avatarFile) {
      try {
        const avatarUrl = await uploadAvatarToCloudinary(avatarFile, userEmail, accountsCollection);
        updatedData.avatarUrl = avatarUrl;
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error('Error uploading avatar:', error.message);
          return NextResponse.json({ error: 'Failed to upload avatar', details: error.message }, { status: 500 });
        } else {
          console.error('Unknown error occurred during avatar upload.');
          return NextResponse.json({ error: 'Failed to upload avatar', details: 'An unknown error occurred.' }, { status: 500 });
        }
      }
    }

    // Handle password update
    if (body.password) {
      const usersCollection = db.collection('users');
      const existingUser = await usersCollection.findOne({ email: userEmail });

      if (existingUser) {
        const hashedPassword = await bcrypt.hash(body.password, 10);
        await usersCollection.updateOne({ email: userEmail }, { $set: { password: hashedPassword } });
      }
    }

    return NextResponse.json({ message: 'Account information saved successfully', account: updatedData }, { status: 200 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error fetching account data:', error.message);
      return NextResponse.json(
        { error: 'Failed to fetch account data', details: error.message },
        { status: 500 }
      );
    }

    console.error('Unknown error occurred');
    return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
  }
}

// Utility: Upload avatar to Cloudinary using a stream
async function uploadAvatarToCloudinary(avatarFile: File, userEmail: string, accountsCollection: any): Promise<string> {
  const buffer = await avatarFile.arrayBuffer();
  const readableStream = Readable.from(Buffer.from(buffer));

  return new Promise<string>((resolve, reject) => {
    const upload = cloudinary.v2.uploader.upload_stream(
      { folder: 'avatars', public_id: `avatar_${userEmail}`, overwrite: true },
      async (error, result) => {
        if (error) return reject(error);
        if (!result) return reject(new Error('No result returned from Cloudinary'));

        const avatarUrl = result.secure_url;
        // Update DB with the new avatarUrl
        await accountsCollection.updateOne({ userEmail }, { $set: { avatarUrl } });
        resolve(avatarUrl);
      }
    );
    readableStream.pipe(upload);
  });
}
