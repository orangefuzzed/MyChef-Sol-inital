import { NextResponse } from 'next/server';
import clientPromise from '../../../../lib/mongodb';
import { ObjectId } from 'mongodb';
import jwt from 'jsonwebtoken';

async function getUserFromToken(req) {
  const token = req.headers.get('Authorization')?.split(' ')[1];
  if (!token) {
    console.log('No token found in request');
    return null;
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const client = await clientPromise;
    const db = client.db("recipe-meal-app");
    return await db.collection("users").findOne({ _id: new ObjectId(decoded.userId) });
  } catch (error) {
    console.error('Error verifying token:', error);
    return null;
  }
}

export async function GET(req) {
  console.log('GET request received for user preferences');
  try {
    const user = await getUserFromToken(req);
    if (!user) {
      console.log('User not found or unauthorized');
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    console.log('User found:', user._id);
    
    if (!user.preferences) {
      console.log('No preferences found, returning default preferences');
      const defaultPreferences = {
        dietaryRestrictions: [],
        cuisinePreferences: [],
        mealsPerDay: 3,
        calorieTarget: 2000,
        allergies: [],
        cookingSkillLevel: 'beginner',
        cookingTime: 'medium',
        familySize: 1,
      };
      return NextResponse.json({ preferences: defaultPreferences });
    }

    console.log('Returning user preferences');
    return NextResponse.json({ preferences: user.preferences });
  } catch (error) {
    console.error('Error in GET preferences:', error);
    return NextResponse.json({ message: "An error occurred", error: error.message }, { status: 500 });
  }
}

export async function PUT(req) {
  console.log('PUT request received for user preferences');
  try {
    const user = await getUserFromToken(req);
    if (!user) {
      console.log('User not found or unauthorized');
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { preferences } = await req.json();
    const client = await clientPromise;
    const db = client.db("recipe-meal-app");

    const result = await db.collection("users").updateOne(
      { _id: user._id },
      { $set: { preferences } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    console.log('Preferences updated successfully');
    return NextResponse.json({ message: "Preferences updated successfully" });
  } catch (error) {
    console.error('Error in PUT preferences:', error);
    return NextResponse.json({ message: "An error occurred", error: error.message }, { status: 500 });
  }
}