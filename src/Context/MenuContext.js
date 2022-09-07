import React, { useCallback, useContext, useState } from 'react';

const ThemeContext = React.createContext();
const ThemeUpdateContext = React.createContext();

export function useTheme() {
  return useContext(ThemeContext);
}

export function useThemeUpdate() {
  return useContext(ThemeUpdateContext);
}

export function ThemeProvider({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleMenu = useCallback(() => {
    setSidebarOpen((prevSideOpen) => !prevSideOpen);
  }, []);

  return (
    <ThemeContext.Provider value={sidebarOpen}>
      <ThemeUpdateContext.Provider value={toggleMenu}>{children}</ThemeUpdateContext.Provider>
    </ThemeContext.Provider>
  );
}
