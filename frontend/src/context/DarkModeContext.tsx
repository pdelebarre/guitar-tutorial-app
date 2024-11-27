import React, { createContext, useContext, useState, useEffect } from "react";

interface DarkModeContextProps {
  nightMode: boolean;
  toggleNightMode: () => void;
}

const DarkModeContext = createContext<DarkModeContextProps | undefined>(
  undefined
);

export const DarkModeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [nightMode, setNightMode] = useState<boolean>(
    window.matchMedia("(prefers-color-scheme: dark)").matches // Check system setting
  );

  const toggleNightMode = () => {
    setNightMode((prevMode) => !prevMode);
  };

  useEffect(() => {
    // Update theme when system setting changes
    const darkModeMediaQuery = window.matchMedia(
      "(prefers-color-scheme: dark)"
    );
    const handleChange = (e: MediaQueryListEvent) => {
      setNightMode(e.matches);
    };

    darkModeMediaQuery.addEventListener("change", handleChange);
    return () => darkModeMediaQuery.removeEventListener("change", handleChange);
  }, []);

  return (
    <DarkModeContext.Provider value={{ nightMode, toggleNightMode }}>
      {children}
    </DarkModeContext.Provider>
  );
};

export const useDarkMode = (): DarkModeContextProps => {
  const context = useContext(DarkModeContext);
  if (!context) {
    throw new Error("useDarkMode must be used within a DarkModeProvider");
  }
  return context;
};
