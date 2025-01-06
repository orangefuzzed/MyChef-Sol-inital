'use client';

import React, { useEffect } from 'react';
import './globals.css';
import { Providers } from './providers'; // Import the Providers component
import { RecipeProvider } from './contexts/RecipeContext'; // Import the RecipeProvider
import { UserProvider } from './contexts/UserContext';
import { ChatProvider } from './contexts/ChatContext'; // Import the ChatProvider
import { PreferencesProvider } from './contexts/PreferencesContext';
import { ToastProvider } from './contexts/ToastContext';
import { Montserrat } from 'next/font/google';

const montserrat = Montserrat({ 
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'] // Add the weights you need
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

  if ('ontouchstart' in window) {
    document.addEventListener('touchstart', (e) => {
      if (e.touches.length > 1) {
        e.preventDefault(); // Prevent multi-touch long presses
      }
    });
  
    document.addEventListener('contextmenu', (e) => {
      e.preventDefault(); // Disable right-click or long-press menus
    });
  }
  

  return (
    <html lang="en" className={montserrat.className}>
      <body>
      <PreferencesProvider>
        <Providers> {/* Wrap the entire app with the Providers component */}          
            <RecipeProvider> {/* Wrap the entire app with the RecipeProvider */}
              <UserProvider> {/* Wrap the entire app with the UserProvider */}
                <ChatProvider> {/* Wrap the entire app with the ChatProvider */}
                  <ToastProvider>
                  {children}
                  </ToastProvider>
                </ChatProvider>
              </UserProvider>
            </RecipeProvider>          
        </Providers>
        </PreferencesProvider>
      </body>
    </html>
  );
}
