'use client';

import React, { useEffect } from 'react';
import './globals.css';
import { Providers } from './providers'; // Import the Providers component
import { RecipeProvider } from './contexts/RecipeContext'; // Import the RecipeProvider
import { UserProvider } from './contexts/UserContext';
import { DM_Sans } from 'next/font/google';

const dmSans = DM_Sans({ 
  subsets: ['latin'],
  weight: ['400', '500', '700'] // Add the weights you need
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Register the service worker when the app is loaded
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then(
          (registration) => {
            console.log('Service Worker registered with scope:', registration.scope);
          },
          (err) => {
            console.error('Service Worker registration failed:', err);
          }
        );
      });
    }
  }, []);

  return (
    <html lang="en" className={dmSans.className}>
      <body>
        <Providers> {/* Wrap the entire app with the Providers component */}
          <RecipeProvider> {/* Wrap the entire app with the RecipeProvider */}
          <UserProvider>
            {children}
            </UserProvider>
          </RecipeProvider>
        </Providers>
      </body>
    </html>
  );
}
