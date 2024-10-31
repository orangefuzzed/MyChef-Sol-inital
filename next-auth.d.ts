import 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      // Add any other properties that your user object might have
    };
  }
}