'use client';  // Add this line at the top of the file

import React, { createContext, useContext, ReactNode } from 'react';

interface AuthContextType {
  user: { id: string; email: string; name: string } | null;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const mockUser = { id: '1', email: 'user@example.com', name: 'Test User' };

  const login = () => {
    // No-op for now
  };

  const logout = () => {
    // No-op for now
  };

  return (
    <AuthContext.Provider value={{ user: mockUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}