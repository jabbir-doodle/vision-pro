import { useState, useEffect } from 'react';

export function useTheme() {
  const [isDarkMode, setIsDarkMode] = useState<boolean | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    const getTheme = () => {
      // Check for explicit theme classes
      if (document.documentElement.classList.contains('dark') || 
          document.body.classList.contains('dark')) {
        return true;
      }
      
      if (document.documentElement.classList.contains('light') || 
          document.body.classList.contains('light')) {
        return false;
      }
      
      // Fall back to system preference
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    };

    const updateTheme = () => {
      setIsDarkMode(getTheme());
    };

    // Set initial theme
    updateTheme();

    // Listen for changes
    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, { 
      attributes: true, 
      attributeFilter: ['class'] 
    });
    observer.observe(document.body, { 
      attributes: true, 
      attributeFilter: ['class'] 
    });

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', updateTheme);

    return () => {
      observer.disconnect();
      mediaQuery.removeEventListener('change', updateTheme);
    };
  }, []);

  const toggleTheme = () => {
    if (isDarkMode !== null) {
      const newTheme = !isDarkMode;
      setIsDarkMode(newTheme);
      
      // Update document classes for persistence
      if (newTheme) {
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light');
      } else {
        document.documentElement.classList.add('light');
        document.documentElement.classList.remove('dark');
      }
    }
  };

  return {
    isDarkMode,
    isClient,
    toggleTheme,
    isReady: isClient && isDarkMode !== null
  };
}