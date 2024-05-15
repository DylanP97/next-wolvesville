"use client";

import { createContext, useContext, useState } from "react";

const InGameKeysContext = createContext();

export const InGameKeysProvider = ({ children }) => {
  const [currentKey, setCurrentKey] = useState(null);

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      console.log("I see that you pressed Enter!");
      setCurrentKey("Enter");
    } else if (event.key === "1") {
      // Handle 1 key press
    } else {
      // Handle other key presses
      console.log("I see that you pressed something!");
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
    throw new Error("useInGameKeys must be used within an KeysProvider");
  }

  return context;
};
