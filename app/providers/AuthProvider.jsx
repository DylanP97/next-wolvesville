"use client";

import io from "socket.io-client";
import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [authState, setAuthState] = useState({
    username: null,
    isConnected: false,
    socketId: null,
  });

  const addRoom = (room) => {
    setRooms([...rooms, room]);
  };

  const setAuthInfo = (username, isConnected, socketId) => {
    setAuthState({ username, isConnected, socketId });
  };

  useEffect(() => {
    console.log(authState.isConnected);
    if (authState.isConnected) {
      const socket = io("http://localhost:5000");
      
      socket.on("connect", () => {
        setAuthInfo(authState.username, true, socket.id);
      });

      socket.on("updateRooms", (updatedRooms) => {
        console.log("Updated rooms:", updatedRooms);
        setRooms(updatedRooms)
      });

      setSocket(socket);

      return () => {
        if (socket) {
          socket.disconnect();
        }
      };
    }
  }, [authState.isConnected, rooms]);

  return <AuthContext.Provider value={{ ...authState, setAuthInfo, socket, rooms, addRoom }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
