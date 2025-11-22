"use client";

import { createContext, useContext, useEffect, useState } from "react";

const RenderContext = createContext();

export function RenderProvider({ children }) {
  const [activeComponent, setActiveComponent] = useState(null);

  const [exitMenuOpen, setExitMenuOpen] = useState(false);
  const toggleExitMenu = () => setExitMenuOpen(prev => !prev);

  useEffect(() => {
    setExitMenuOpen(false)
  }, [activeComponent]);

  return (
    <RenderContext.Provider
      value={{
        activeComponent,
        setActiveComponent,

        // expose exit menu state globally
        exitMenuOpen,
        setExitMenuOpen,
        toggleExitMenu,
      }}
    >
      {children}
    </RenderContext.Provider>
  );
}

export const useToRender = () => {
  const context = useContext(RenderContext);

  if (!context) {
    throw new Error("useToRender must be used within a RenderProvider");
  }

  return context;
};
