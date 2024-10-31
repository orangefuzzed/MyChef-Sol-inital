// Updated app/api/auth/authOptions.ts
import { MongoClient } from 'mongodb';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { JWT } from 'next-auth/jwt'; // Import the correct type
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
            throw new Error('MONGODB_URI is not defined in the environment variables.');
            }

            const client = new MongoClient(uri);

        try {
          await client.connect();
          const db = client.db(); // Access your database

          // Find the user in the 'users' collection by email
          const authUser = await db.collection('users').findOne({ email: credentials?.email });

          // If user is not found in 'users' collection
          if (!authUser) {
            console.error('No user found with this email');
            throw new Error('No user found with this email');
          }

          // Ensure that the password is defined before proceeding
          if (!credentials?.password) {
            console.error('Password is not provided in the credentials');
            throw new Error('Password is not provided');
          }

          // Verify password using bcrypt
          const isValidPassword = await bcrypt.compare(credentials.password, authUser.password);
          if (!isValidPassword) {
            console.error('Invalid password');
            throw new Error('Invalid password');
          }

          // Prepare the user object to return
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
    async jwt({ token, user }: { token: JWT; user?: any }) {
      if (user) {
        token.id = user.id;
        token.email = user.email || '';
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
