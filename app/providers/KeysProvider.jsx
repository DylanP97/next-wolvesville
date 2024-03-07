"use client";

import { createContext, useContext, useState, useEffect } from "react";

const KeysContext = createContext();

export const KeysProvider = ({ children }) => {
    const [currentKey, setCurrentKey] = useState(null);

    const handleKeyDown = (event) => {
        if (event.key === "Enter") {
            console.log("I see that you pressed Enter!")
            setCurrentKey("Enter")
        } else if (event.key === "1") {
            // Handle 1 key press
        } else {
            // Handle other key presses
            console.log("I see that you pressed something!")
        }
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
