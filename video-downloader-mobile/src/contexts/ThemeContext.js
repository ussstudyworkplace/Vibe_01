/**
 * Theme Context for Dark/Light Mode
 */

import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'react-native';

// Theme Colors
const lightTheme = {
  name: 'light',
  colors: {
    primary: '#6c5ce7',
    primaryLight: '#a29bfe',
    primaryDark: '#5649c0',
    secondary: '#00cec9',
    background: '#ffffff',
    backgroundSecondary: '#f8f9fa',
    card: '#ffffff',
    text: '#2d3436',
    textLight: '#636e72',
    textDark: '#2d3436',
    border: '#e0e0e0',
    error: '#ff4757',
    success: '#2ed573',
    warning: '#ffa502',
    info: '#1e90ff',
  },
};

const darkTheme = {
  name: 'dark',
  colors: {
    primary: '#8e44ad',
    primaryLight: '#a29bfe',
    primaryDark: '#732d91',
    secondary: '#16a085',
    background: '#1a1a2e',
    backgroundSecondary: '#16213e',
    card: '#16213e',
    text: '#f5f6fa',
    textLight: '#b2bec3',
    textDark: '#f5f6fa',
    border: '#2d3748',
    error: '#ff6b81',
    success: '#4ecdc4',
    warning: '#ffa502',
    info: '#1e90ff',
  },
};

// Theme Context
const ThemeContext = createContext({
  theme: lightTheme,
  isDark: false,
  toggleTheme: () => {},
});

// Theme Provider
const ThemeProvider = ({ children }) => {
  const systemTheme = useColorScheme();
  const [theme, setTheme] = useState(lightTheme);
  const [isDark, setIsDark] = useState(false);

  // Load saved theme
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('theme');
        if (savedTheme) {
          setTheme(savedTheme === 'dark' ? darkTheme : lightTheme);
          setIsDark(savedTheme === 'dark');
        } else {
          // Use system theme if no saved preference
          setTheme(systemTheme === 'dark' ? darkTheme : lightTheme);
          setIsDark(systemTheme === 'dark');
        }
      } catch (error) {
        console.error('Error loading theme:', error);
      }
    };
    loadTheme();
  }, [systemTheme]);

  // Toggle theme
  const toggleTheme = async () => {
    const newTheme = isDark ? lightTheme : darkTheme;
    const newIsDark = !isDark;
    
    setTheme(newTheme);
    setIsDark(newIsDark);
    
    try {
      await AsyncStorage.setItem('theme', newTheme.name);
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use theme
const useTheme = () => {
  const context = React.useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export { ThemeContext, ThemeProvider, useTheme, lightTheme, darkTheme };
