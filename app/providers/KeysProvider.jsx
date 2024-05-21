"use client";

import { createContext, useContext, useEffect, useState } from "react";

const KeysContext = createContext();

export const KeysProvider = ({ children }) => {
  const [currentKey, setCurrentKey] = useState(null);
  const [onInput, setOnInput] = useState(false);

  console.log(onInput);

  useEffect(() => {
    const handleFocus = (event) => {
      if (event.target.tagName === "INPUT") {
        setOnInput(true);
      }
    };

    const handleBlur = (event) => {
      if (event.target.tagName === "INPUT") {
        setOnInput(false);
      }
    };

    // Attach event listeners to the document
    document.addEventListener("focusin", handleFocus);
    document.addEventListener("focusout", handleBlur);

    return () => {
      // Clean up event listeners
      document.removeEventListener("focusin", handleFocus);
      document.removeEventListener("focusout", handleBlur);
    };
  }, []);

  const handleKeyDown = (event) => {
    if (!onInput) setCurrentKey(event.key);
  };

  return (
    <KeysContext.Provider value={{ currentKey, setCurrentKey }}>
      <div onKeyDown={handleKeyDown} tabIndex={0}>
        {children}
      </div>
    </KeysContext.Provider>
  );
};

export const useKeys = () => {
  const context = useContext(KeysContext);

  if (!context) {
    throw new Error("useKeys must be used within an KeysProvider");
  }

  return context;
};
