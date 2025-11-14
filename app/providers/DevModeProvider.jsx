"use client";

import { createContext, useContext, useEffect, useState } from "react";

const DevModeContext = createContext();

export function DevModeProvider({ children }) {
  const [isDevMode, setIsDevMode] = useState(false);

  // Load dev mode state from localStorage on mount
  useEffect(() => {
    const savedDevMode = localStorage.getItem("devMode");
    if (savedDevMode !== null) {
      setIsDevMode(savedDevMode === "true");
    }
  }, []);

  // Save dev mode state to localStorage whenever it changes
  const toggleDevMode = () => {
    setIsDevMode((prev) => {
      const newValue = !prev;
      localStorage.setItem("devMode", String(newValue));
      return newValue;
    });
  };

  return (
    <DevModeContext.Provider
      value={{
        isDevMode,
        toggleDevMode,
        setIsDevMode,
      }}
    >
      {children}
    </DevModeContext.Provider>
  );
}

export const useDevMode = () => {
  const context = useContext(DevModeContext);

  if (!context) {
    throw new Error("useDevMode must be used within a DevModeProvider");
  }

  return context;
};

