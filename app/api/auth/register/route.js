import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import clientPromise from '../../../../lib/mongodb';

export async function POST(req) {
  try {
    const { email, password } = await req.json();
    const client = await clientPromise;
    const db = client.db("recipe-meal-app");

    // Check if user already exists
    const existingUser = await db.collection("users").findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: "User already exists" }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user with default preferences
    const defaultPreferences = {
      dietaryRestrictions: [],
      cuisinePreferences: [],
      mealsPerDay: 3,
      allergies: [],
      cookingSkillLevel: 'beginner',
      cookingTime: 'medium',
      familySize: 1,
    };

    // Add new user with default onboarding status
    await db.collection("users").insertOne({
      email,
      password: hashedPassword,
      preferences: defaultPreferences,
      hasSeenOnboarding: false, // Default onboarding status for new users
    });

    return NextResponse.json({ message: "User registered successfully" }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "An error occurred" }, { status: 500 });
  }
}
