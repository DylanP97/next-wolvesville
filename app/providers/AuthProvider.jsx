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
  });
  const [isInRoom, setIsInRoom] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [game, setGame] = useState(null)

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
        let user = updatedUsers.find((user) => user.username == authState.username);
        setIsInRoom(user.isInRoom)
      });

      socket.on("updateRooms", (updatedRooms) => {
        setRooms(updatedRooms)
      });

      socket.on("launchRoom", (roomId) => {
        let game = rooms.find((room) => room.id === roomId);
        setGame(game);
        setIsPlaying(true);
      });

      setSocket(socket);

      return () => {
        if (socket) {
          socket.disconnect();
        }
      };
    }
  }, [authState.isConnected]);

  return <AuthContext.Provider value={{ ...authState, setAuthInfo, socket, rooms, addRoom, connectedUsers, isInRoom, isPlaying, game }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
