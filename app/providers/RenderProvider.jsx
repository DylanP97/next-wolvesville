// RenderProvider.js
"use client";

import { createContext, useContext, useEffect, useState } from "react";

const RenderContext = createContext();

export function RenderProvider({ children }) {
  const [activeComponent, setActiveComponent] = useState(null);

  return (
    <RenderContext.Provider
      value={{
        activeComponent,
        setActiveComponent,
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
