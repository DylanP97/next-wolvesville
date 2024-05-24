"use client";

import io from "socket.io-client";
import { createContext, useContext, useState, useEffect } from "react";
import cpuNextMove from "../lib/cpuNextMove";
import { useGame } from "../game/providers/GameProvider";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [connectedUsers, setConnectedUsers] = useState([]);
  const [authState, setAuthState] = useState({
    username: null,
    avatar: null,
    isConnected: false,
    socketId: null,
  });
  const [isInRoom, setIsInRoom] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [game, setGame] = useState(null);

  const updateGameState = (newIsInRoom, newIsPlaying, newGame) => {
    setIsInRoom(newIsInRoom);
    setIsPlaying(newIsPlaying);
    setGame(newGame);
  };

  const addRoom = (room) => {
    setRooms([...rooms, room]);
  };

  const setAuthInfo = (username, avatar, isConnected, socketId) => {
    setAuthState({ username, avatar, isConnected, socketId });
  };

  useEffect(() => {
    if (authState.isConnected) {
      const socket = io(process.env.NEXT_PUBLIC_API_URL);
      let user = { username: authState.username, avatar: authState.avatar };

      socket.on("connect", () => {
        user = { ...user, socketId: socket.id };
        setAuthInfo(authState.username, authState.avatar, true, socket.id);
        socket.emit("sendNewConnectedUser", user);
      });

      socket.on("updateUsers", (updatedUsers) => {
        let user = updatedUsers.find(
          (user) => user.username == authState.username
        );
        if (user.isInRoom) setIsInRoom(user.isInRoom);
        setConnectedUsers(updatedUsers);
      });

      socket.on("updateRooms", (updatedRooms) => {
        setRooms(updatedRooms);
      });

      socket.on("launchRoom", (game) => {
        game.playersList.map((player) => {
          if (player.isCPU) {
            console.log("hello");
            socket.emit("sendNewConnectedUser", player);
          }
        });
        setGame(game);
        setIsPlaying(true);
      });

      socket.on("updateGame", (updatedGame) => {
        console.log(updatedGame.playersList);
        setGame(updatedGame);
      });

      setSocket(socket);

      return () => {
        if (socket) {
          socket.disconnect();
        }
      };
    }
  }, [authState.isConnected]);

  return (
    <AuthContext.Provider
      id="authcontext"
      value={{
        ...authState,
        setAuthInfo,
        socket,
        rooms,
        addRoom,
        connectedUsers,
        isInRoom,
        isPlaying,
        game,
        updateGameState,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
