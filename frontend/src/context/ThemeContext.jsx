import React, { createContext, useContext, useEffect } from 'react';

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const theme = 'dark';

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;

    root.classList.remove('light');
    root.classList.add('dark');
    root.style.colorScheme = 'dark';

    if (body) {
      body.classList.remove('light');
      body.classList.add('dark');
    }

    localStorage.setItem('fitadapt_theme', 'dark');
  }, []);

  const toggleTheme = () => {};
  const setTheme = () => {};

  return (
    <ThemeContext.Provider value={{ theme: 'dark', isDark: true, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
