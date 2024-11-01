// types/next-auth.d.ts

import 'next-auth';

declare module 'next-auth' {
  interface User {
    id: string;
    email: string; // Make email a required property
    name?: string | null;
    image?: string | null;
    username?: string | null;
    displayName?: string | null;
  }

  interface Session {
    user: User;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    email: string; // Make email a required property
    username?: string | null;
    displayName?: string | null;
  }
}
