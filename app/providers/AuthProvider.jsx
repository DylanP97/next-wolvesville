"use client";

import { createContext, useContext, useState, useEffect } from "react";
import io from "socket.io-client";
import { useSound } from "./SoundProvider";

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
  const [token, setToken] = useState(null);
  const [isInRoom, setIsInRoom] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGuest, setIsGuest] = useState(false);
  const [game, setGame] = useState(null);

  const {
    playTrack,
    generateBackgroundMusic,
    setCurrentBgMusic,
    generateNoise,
  } = useSound();

  const updateUserGameState = (newIsInRoom, newIsPlaying, newGame) => {
    setIsInRoom(newIsInRoom);
    setIsPlaying(newIsPlaying);
    setGame(newGame);
    socket.emit(
      "updateUserGameState",
      authState.username,
      newIsInRoom,
      newIsPlaying,
      newGame
    );
  };

  const addRoom = (room) => {
    setRooms([...rooms, room]);
  };

  const setAuthInfo = (username, avatar, isConnected, socketId) => {
    setAuthState({ username, avatar, isConnected, socketId });
  };

  async function checkAuth() {
    const response = await fetch(
      process.env.NEXT_PUBLIC_API_URL + "/api/user/checkAuth",
      {
        method: "GET",
        credentials: "include",
      }
    );
    if (response.ok) {
      const data = await response.json();
      console.log("User is authenticated:", data);
      setAuthInfo(data.username, data.avatar, true, data.socketId);
      setToken(data.token);
      setIsGuest(data.isGuest);
      setIsPlaying(data.isPlaying);
      setIsInRoom(data.isInRoom);
      setGame(data.game);
      const newSocket = io(process.env.NEXT_PUBLIC_API_URL, {
        query: { token: data.token },
      });
      setSocket(newSocket);
    } else {
      console.log("User is not authenticated");
    }
  }

  /** execution */

  useEffect(() => {
    setCurrentBgMusic(null);
  }, [isPlaying]);

  useEffect(() => {
    if (authState.isConnected) {
      generateBackgroundMusic();
    }
  }, [authState.isConnected]);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on("updateUsers", (updatedUsers) => {
        let user = updatedUsers.find(
          (user) => user.username === authState.username
        );
        if (user?.isInRoom) setIsInRoom(user.isInRoom);
        setConnectedUsers(updatedUsers.filter((usr) => !usr.isCPU));
      });

      socket.on("updateRooms", (updatedRooms) => {
        setRooms(updatedRooms);
      });

      socket.on("launchRoom", (game) => {
        game.playersList.forEach((player) => {
          if (player.isCPU) {
            socket.emit("sendNewConnectedUser", player);
          }
        });
        setGame(game);
        setIsPlaying(true);
        const clientPlayer = game.playersList.find(
          (ply) => ply.name === authState.username
        );
        if (clientPlayer?.role.name === "Serial Killer") {
          playTrack("/audio/serialKillerVibe.mp3");
        }
      });

      socket.on("updateGame", (updatedGame) => {
        setGame(updatedGame);
      });

      socket.on("triggerSoundForAll", (sound) => {
        generateNoise(sound);
      });

      return () => {
        socket.disconnect();
      };
    }
  }, [socket]);

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        setAuthInfo,
        socket,
        setSocket,
        setToken,
        rooms,
        addRoom,
        connectedUsers,
        isInRoom,
        isPlaying,
        game,
        updateUserGameState,
        isGuest,
        setIsGuest,
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
