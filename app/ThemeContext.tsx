'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Theme as RadixTheme } from '@radix-ui/themes';

type ColorTheme = 'default' | 'ruby' | 'cyan' | 'teal';

interface ThemeContextType {
  colorTheme: ColorTheme;
  setColorTheme: (theme: ColorTheme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [colorTheme, setColorTheme] = useState<ColorTheme>('default');

  useEffect(() => {
    document.body.className = colorTheme;
  }, [colorTheme]);

  return (
    <ThemeContext.Provider value={{ colorTheme, setColorTheme }}>
      <RadixTheme>
        {children}
      </RadixTheme>
    </ThemeContext.Provider>
  );
};

export const useColorTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useColorTheme must be used within a ThemeProvider');
  }
  return context;
};