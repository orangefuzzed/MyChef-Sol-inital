// app/api/auth/[...nextauth]/route.js

import { MongoClient } from 'mongodb';
import NextAuth from 'next-auth/next';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import FacebookProvider from 'next-auth/providers/facebook';
import bcrypt from 'bcryptjs';

const uri = process.env.MONGODB_URI; // MongoDB connection string

const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const client = new MongoClient(uri);
        try {
          await client.connect();
          const db = client.db(); // Access your database

          // Find the user in the 'users' collection by email
          const authUser = await db.collection('users').findOne({ email: credentials.email });

          // Log the retrieved user details for debugging
          console.log('Retrieved user from DB:', authUser);

          // If user is not found in 'users' collection
          if (!authUser) {
            console.error('No user found with this email');
            throw new Error('No user found with this email');
          }

          // Ensure that the password is defined before proceeding
          if (!credentials.password) {
            console.error('Password is not provided in the credentials');
            throw new Error('Password is not provided');
          }

          // Verify password using bcrypt
          const isValidPassword = await bcrypt.compare(credentials.password, authUser.password);
          console.log('Password validation result:', isValidPassword);
          if (!isValidPassword) {
            console.error('Invalid password');
            throw new Error('Invalid password');
          }

          // Find the user's profile data in the 'accounts' collection
          const userAccount = await db.collection('accounts').findOne({ userEmail: credentials.email });

          // Prepare the user object to return
          return {
            id: authUser._id.toString(),
            displayName: userAccount?.displayName || '',
            email: authUser.email,
          };
        } catch (error) {
          console.error('Error in authorize:', error);
          return null;
        } finally {
          await client.close(); // Close the database connection
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    // Updated JWT Callback
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.displayName = user.displayName || '';
        token.email = user.email || '';
      }
      return token;
    },
    // Updated Session Callback
    async session({ session, token }) {
      if (token) {
        session.user = {
          ...session.user,
          id: token.id,
          displayName: token.displayName || '',
          email: token.email || '',
        };
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
