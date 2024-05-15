"use client";

import { createContext, useContext, useEffect, useState } from "react";

const KeysContext = createContext();

export const KeysProvider = ({ children }) => {
  const [currentKey, setCurrentKey] = useState(null);
  const [onInput, setOnInput] = useState(false);

  useEffect(() => {
    const handleInput = () => {
      setOnInput(true);
    };

    const handleBlur = () => {
        console.log("hello")
      setOnInput(false);
    };

    const inputsField = document.querySelectorAll("input");

    inputsField.forEach((input) => {
      input.addEventListener("input", handleInput);
      input.addEventListener("blur", handleBlur);
    });

    return () => {
      // Clean up event listeners
      inputsField.forEach((input) => {
        input.removeEventListener("input", handleInput);
        input.removeEventListener("blur", handleBlur);
      });
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
