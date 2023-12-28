'use client'
import { createContext, useContext, useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:3001");

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socketId, setSocketId] = useState(null);
  const socket = io("http://localhost:3001");

  useEffect(() => {
    socket.on("your_id", (data) => {
      setSocketId(data.id);
    });

    return () => {
      socket.off("your_id");
    };
  }, [socket]);

  return (
    <SocketContext.Provider value={{ socket, socketId }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  return useContext(SocketContext);
};
