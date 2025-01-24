import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import clientPromise from '../../../../lib/mongodb';

export async function POST(req) {
    try {
        const { token, newPassword } = await req.json();
        const client = await clientPromise;
        const db = client.db("recipe-meal-app");

        // Find user by reset token
        const user = await db.collection("users").findOne({ resetToken: token });

        // Validate token & expiration
        if (!user || new Date(user.resetTokenExpires) < new Date()) {
            return NextResponse.json({ message: "Invalid or expired token" }, { status: 400 });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update user record with new password & remove reset token
        await db.collection("users").updateOne(
            { resetToken: token },
            { $set: { password: hashedPassword }, $unset: { resetToken: "", resetTokenExpires: "" } }
        );

        return NextResponse.json({ message: "Password updated successfully!" }, { status: 200 });
    } catch (error) {
        console.error("RESET PASSWORD ERROR:", error);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}
