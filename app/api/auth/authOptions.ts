// app/api/auth/authOptions.ts

import Auth0Provider from 'next-auth/providers/auth0';
import CredentialsProvider from 'next-auth/providers/credentials';
import { JWT } from 'next-auth/jwt';
import { Session, User } from 'next-auth';
import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';

const uri = process.env.MONGODB_URI || ''; // MongoDB connection string

export const authOptions = {
  providers: [
    Auth0Provider({
      clientId: process.env.AUTH0_CLIENT_ID || '',
      clientSecret: process.env.AUTH0_CLIENT_SECRET || '',
      issuer: process.env.AUTH0_DOMAIN || '',
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials) {
          throw new Error('Missing credentials');
        }

        const client = new MongoClient(uri);
        try {
          await client.connect();
          const db = client.db(); // Access your database

          // Find the user in the 'users' collection by email
          const authUser = await db.collection('users').findOne({ email: credentials.email });

          // If user is not found in 'users' collection
          if (!authUser) {
            console.error('No user found with this email');
            return null;
          }

          // Verify password using bcrypt
          const isValidPassword = await bcrypt.compare(credentials.password, authUser.password);
          if (!isValidPassword) {
            console.error('Invalid password');
            return null;
          }

          // Prepare the user object to return
          return {
            id: authUser._id.toString(),
            email: authUser.email,
            displayName: authUser.displayName || '',
          };
        } catch (error) {
          console.error('Error in authorize:', error);
          return null;
        } finally {
          await client.close(); // Close the database connection
        }
      },
    }),
  ],
  callbacks: {
    // Updated JWT Callback
    async jwt({ token, user }: { token: JWT; user?: User }) {
      if (user) {
        token.id = user.id;
        token.email = user.email || '';
        token.displayName = user.displayName || '';
      }
      return token;
    },
    // Updated Session Callback
async session({ session, token }: { session: Session; token: JWT }) {
    if (token) {
      session.user = {
        ...session.user,
        id: token.id,
        email: token.email || '',
        displayName: token.displayName || '',
        username: token.username || '',
      } as Session['user'];
    }
    return session;
  },
  },
  pages: {
    signIn: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
};
