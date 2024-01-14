"use client";

import io from "socket.io-client";
import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [authState, setAuthState] = useState({
    username: null,
    isConnected: false,
    socketId: null,
  });

  const setAuthInfo = (username, isConnected, socketId) => {
    setAuthState({ username, isConnected, socketId });
  };

  useEffect(() => {
    console.log(authState.isConnected);
    if (authState.isConnected) {
      const socket = io("http://localhost:5000");
      socket.on("connect", () => {
        console.log("Connected to server");
        console.log(socket.id);
        setAuthInfo(authState.username, true, socket.id);
      });
  
      setSocket(socket);
  
      return () => {
        if (socket) {
          socket.disconnect();
        }
      };
    }
    
  }, [authState.isConnected]);

  return <AuthContext.Provider value={{ ...authState, setAuthInfo, socket }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
