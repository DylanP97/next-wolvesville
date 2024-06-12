"use client";

import { createContext, useContext, useState } from "react";

const InGameKeysContext = createContext();

export const InGameKeysProvider = ({ children }) => {
  const [currentKey, setCurrentKey] = useState(null);

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      setCurrentKey("Enter");
    } else if (event.key === "1") {
      // Handle 1 key press
    } else {
      // Handle other key presses
    }
  };

  return (
    <InGameKeysContext.Provider value={{ currentKey, setCurrentKey }}>
      <div onKeyDown={handleKeyDown} tabIndex={0}>
        {children}
      </div>
    </InGameKeysContext.Provider>
  );
};

export const useInGameKeys = () => {
  const context = useContext(InGameKeysContext);

  if (!context) {
    throw new Error("useInGameKeys must be used within an InGameKeysProvider");
  }

  return context;
};
