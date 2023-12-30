"use client";

import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    username: null,
    isConnected: false,
    socketId: null,
  });

  const setAuthInfo = (username, isConnected, socketId) => {
    setAuthState({ username, isConnected, socketId });
  };

  return <AuthContext.Provider value={{ ...authState, setAuthInfo }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
