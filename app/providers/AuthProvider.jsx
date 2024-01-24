"use client";

import io from "socket.io-client";
import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [connectedUsers, setConnectedUsers] = useState([])
  const [authState, setAuthState] = useState({
    username: null,
    isConnected: false,
    socketId: null,
    isInAGame: false,
    roomPlaying: null
  });

  const addRoom = (room) => {
    setRooms([...rooms, room]);
  };

  const setAuthInfo = (username, isConnected, socketId) => {
    setAuthState({ username, isConnected, socketId });
  };

  useEffect(() => {
    if (authState.isConnected) {
      const socket = io("http://localhost:5000");

      let user = { username: authState.username }

      socket.on("connect", () => {
        user = { ...user, socketId: socket.id }
        setAuthInfo(authState.username, true, socket.id);
        socket.emit("sendNewConnectedUser", user);
      });

      socket.on("updateUsers", (updatedUsers) => {
        setConnectedUsers(updatedUsers)
      });

      socket.on("updateRooms", (updatedRooms) => {
        setRooms(updatedRooms)

        // chercher si le username est dans une des rooms qui est isLaunched
        const launchedRooms = updatedRooms.filter((room) => room.isLaunched)
        console.log(launchedRooms)
        if (launchedRooms) {
          let isInAGame = launchedRooms.some((room) => room.usersInTheRoom.some((usr) => usr.username == username))
          if (isInAGame) {
            setAuthState(...authState, isInAGame);
            roomPlaying = launchedRooms.find((room) => room.usersInTheRoom.some((usr) => usr.username == username))
            setAuthState(...authState, roomPlaying);
          } 
        }
      });

      setSocket(socket);

      return () => {
        if (socket) {
          socket.disconnect();
        }
      };
    }
  }, [authState.isConnected]);

  return <AuthContext.Provider value={{ ...authState, setAuthInfo, socket, rooms, addRoom, connectedUsers }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
