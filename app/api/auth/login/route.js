// Updated app/api/auth/login/route.js

import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import clientPromise from '../../../../lib/mongodb';

const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        console.log("Login request received");
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const client = await clientPromise;
          const db = client.db("recipe-meal-app");

          // Find user
          const user = await db.collection("users").findOne({ email: credentials.email });
          if (!user) {
            console.log('User not found');
            return null;
          }

          // Check password
          const isMatch = await bcrypt.compare(credentials.password, user.password);
          if (!isMatch) {
            console.log('Password does not match');
            return null;
          }

          // Create token
          const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

          console.log('Login successful');
          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name || user.email.split('@')[0],
            token: token
          };
        } catch (error) {
          console.error('Login error:', error);
          return null;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.token = user.token;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.email = token.email;
      session.user.name = token.name;
      session.user.token = token.token;
      return session;
    }
  },
  pages: {
    signIn: '/login',
  },
  secret: process.env.JWT_SECRET,
};

// Correct the export for the route as a valid HTTP handler
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
