// Updated app/api/auth/authOptions.ts

import Auth0Provider from 'next-auth/providers/auth0';
import { JWT } from 'next-auth/jwt'; // Import the correct type
import { Session } from 'next-auth';

export const authOptions = {
  providers: [
    Auth0Provider({
      clientId: process.env.AUTH0_CLIENT_ID || '',
      clientSecret: process.env.AUTH0_CLIENT_SECRET || '',
      issuer: process.env.AUTH0_DOMAIN || '',
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

