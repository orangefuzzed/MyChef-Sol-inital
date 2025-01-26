import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ message: "User not authenticated" }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db("recipe-meal-app");

    const user = await db.collection("users").findOne(
      { email: session.user.email },
      { projection: { hasCreatedPasswordHint: 1 } }
    );

    return NextResponse.json({ hasCreatedPasswordHint: user?.hasCreatedPasswordHint ?? false }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ message: "User not authenticated" }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db("recipe-meal-app");

    await db.collection("users").updateOne(
      { email: session.user.email },
      { $set: { hasCreatedPasswordHint: true } }
    );

    return NextResponse.json({ message: "Password hint status updated" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
