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
  useEffect(() => {
    // Service Worker Registration
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then(
          (registration) => {
            if (process.env.NODE_ENV === 'development') {
              console.log('Service Worker registered with scope:', registration.scope);
            }
          },
          (err) => {
            if (process.env.NODE_ENV === 'development') {
              console.error('Service Worker registration failed:', err);
            }
          }
        );
      });
    }
  }, []);

  useEffect(() => {
    // Multi-Touch and Context Menu Prevention
    const preventMultiTouch = (e: TouchEvent) => {
      if (e.touches.length > 1) {
        e.preventDefault(); // Prevent multi-touch long presses
      }
    };

    const disableContextMenu = (e: MouseEvent) => {
      e.preventDefault(); // Disable right-click or long-press menus
    };

    if (typeof window !== 'undefined' && 'ontouchstart' in window) {
      document.addEventListener('touchstart', preventMultiTouch);
      document.addEventListener('contextmenu', disableContextMenu);
    }

    // Cleanup Event Listeners
    return () => {
      if (typeof window !== 'undefined') {
        document.removeEventListener('touchstart', preventMultiTouch);
        document.removeEventListener('contextmenu', disableContextMenu);
      }
    };
  }, []);

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
