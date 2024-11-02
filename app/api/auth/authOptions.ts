// Updated app/api/auth/authOptions.ts

import { MongoClient } from 'mongodb';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { JWT } from 'next-auth/jwt';
import { Session } from 'next-auth';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const uri = process.env.MONGODB_URI;

        if (!uri) {
          console.error('MONGODB_URI is not defined in the environment variables.');
          throw new Error('MONGODB_URI is not defined in the environment variables.');
        }

        console.log('Authorize called with credentials:', credentials);
        if (!credentials?.email || !credentials?.password) {
          console.error('Missing email or password');
          return null;
        }

        const client = new MongoClient(uri);
        try {
          await client.connect();
          const db = client.db(); // Access your database

          console.log('Looking up user in database for email:', credentials.email);
          const authUser = await db.collection('users').findOne({ email: credentials.email });

          if (!authUser) {
            console.error('No user found with this email');
            return null;
          }

          const isValidPassword = await bcrypt.compare(credentials.password, authUser.password);
          console.log('Password validation result:', isValidPassword);
          if (!isValidPassword) {
            console.error('Invalid password');
            return null;
          }

          // Find the user's profile data in the 'accounts' collection
          const userAccount = await db.collection('accounts').findOne({ userEmail: credentials.email });

          console.log('Login successful, returning user:', { id: authUser._id.toString(), email: authUser.email });
          return {
            id: authUser._id.toString(),
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
  ],
  callbacks: {
    // Updated JWT Callback
    async jwt({ token, user }: { token: JWT; user?: Record<string, unknown> }) {
      if (user) {
        token.id = user.id as string; // Cast to string since id is a string
        token.email = user.email as string || '';
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
