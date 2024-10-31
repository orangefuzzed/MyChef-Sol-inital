'use client';

import { SessionProvider } from "next-auth/react";
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './components/ui/use-toast';
import { AIProvider } from './contexts/AIContext';
import { RecipeProvider } from './contexts/RecipeContext'; // Import RecipeProvider

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AuthProvider>
        <AIProvider>
          <RecipeProvider> {/* Wrap RecipeProvider here */}
            <ToastProvider>
              {children}
            </ToastProvider>
          </RecipeProvider>
        </AIProvider>
      </AuthProvider>
    </SessionProvider>
  );
}
