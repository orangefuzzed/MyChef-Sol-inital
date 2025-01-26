import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import clientPromise from '../../../../lib/mongodb';
import { sendWelcomeEmail } from '../../../../lib/sendEmail';

export async function POST(req) {
  try {
    const { email, password, passwordHint } = await req.json();
    const client = await clientPromise;
    const db = client.db("recipe-meal-app");

    // Check if user already exists
    const existingUser = await db.collection("users").findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: "User already exists" }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Default user preferences
    const defaultPreferences = {
      dietaryRestrictions: [],
      cuisinePreferences: [],
      mealsPerDay: 3,
      allergies: [],
      cookingSkillLevel: 'beginner',
      cookingTime: 'medium',
      familySize: 1,
    };

    // Create new user (Consolidated into ONE insert)
    const newUser = {
      email,
      password: hashedPassword,
      passwordHint, // NEW FIELD! 💥
      preferences: defaultPreferences,
      hasSeenOnboarding: false,
      hasCreatedAccount: true, // Fixed inconsistent casing
    };

    await db.collection("users").insertOne(newUser);

    // Send welcome email
    await sendWelcomeEmail(email);

    return NextResponse.json({ message: "User registered successfully" }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "An error occurred" }, { status: 500 });
  }
}
