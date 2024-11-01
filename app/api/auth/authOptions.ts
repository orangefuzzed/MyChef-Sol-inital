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
      async authorize(credentials): Promise<User | null> {
        if (!credentials) {
          throw new Error('Missing credentials');
        }

        const client = new MongoClient(uri);
        try {
          await client.connect();
          const db = client.db(); // Access your database

          // Find the user in the 'accounts' collection by userEmail
          const authUser = await db
            .collection('accounts')
            .findOne({ userEmail: credentials.email });

          // If user is not found in 'accounts' collection
          if (!authUser) {
            console.error('No user found with this email');
            return null;
          }

          // Ensure that passwordHash is present
          if (!authUser.passwordHash) {
            console.error('User does not have a password set');
            return null;
          }

          // Verify password using bcrypt
          const isValidPassword = await bcrypt.compare(
            credentials.password,
            authUser.passwordHash
          );
          if (!isValidPassword) {
            console.error('Invalid password');
            return null;
          }

          // Prepare the user object to return
          const user: User = {
            id: authUser._id.toString(),
            email: authUser.userEmail,
            displayName: authUser.displayName || '',
            username: authUser.username || '',
            name: authUser.displayName || '', // Include if needed
            image: authUser.avatarUrl || null, // Include if needed
          };

          return user;
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
        token.email = user.email;
        token.displayName = user.displayName || '';
        token.username = user.username || '';
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
