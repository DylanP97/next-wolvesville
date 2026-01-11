"use client";

import { createContext, useContext, useState, useEffect } from "react";
import io from "socket.io-client";
import { useSound } from "./SoundProvider";
import { useAnimation } from "./AnimationProvider";

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
  const [isDev, setIsDev] = useState(false);

  const {
    generateNoise,
    generateBackgroundMusic,
    stopMusic,
  } = useSound();

  const { triggerAnimation } = useAnimation();

  const updateUserGameState = (newIsInRoom, newIsPlaying) => {
    setIsInRoom(newIsInRoom);
    setIsPlaying(newIsPlaying);
    socket.emit(
      "updateUserGameState",
      authState.username,
      newIsInRoom,
      newIsPlaying
    );
  };

  const addRoom = (room) => {
    setRooms([...rooms, room]);
  };

  const setAuthInfo = (username, avatar, isConnected, socketId) => {
    setAuthState({ username, avatar, isConnected, socketId });
  };

  async function checkAuth() {
    if (typeof window === 'undefined') return;

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

    const response = await fetch(
      API_URL + "/api/user/checkAuth",
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
      setIsDev(data.isDev);
      const newSocket = io(API_URL, {
        query: { token: data.token },
      });
      setSocket(newSocket);
    } else {
    }
  }

  /** execution */


  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (!authState.isConnected) {
      setIsDev(false);
      return;
    }

    if (isPlaying) {
      stopMusic();
      return;
    }

    if (!isPlaying) {
      stopMusic();
      generateBackgroundMusic();
      return;
    }

  }, [authState.isConnected, isPlaying]);

  useEffect(() => {
    if (!socket) return;

    const handleUpdateUsers = (updatedUsers) => {
      const user = updatedUsers.find(u => u.username === authState.username);
      if (user) setIsInRoom(user.isInRoom);
      setConnectedUsers(updatedUsers.filter(usr => !usr.isCPU));
    };

    const handleUpdateRooms = (updatedRooms) => {
      setRooms(updatedRooms);
    };

    const handleLaunchRoom = (game) => {
      game.playersList.forEach((player) => {
        if (player.isCPU) {
          socket.emit("sendNewConnectedUser", player);
        }
      });
      setGame(game);
      setIsPlaying(true);
    };

    const handleUpdateGame = (updatedGame) => {
      setGame(updatedGame);
    };

    const handleTriggerSound = (sound) => {
      generateNoise(sound);
    };

    const handleTriggerAnimation = (animation) => {
      // Handle both old format (string) and new format (object with name and text)
      if (typeof animation === 'string') {
        triggerAnimation(animation);
      } else if (animation && animation.name) {
        triggerAnimation(animation.name, animation.text);
      } else {
        console.warn("Invalid animation format:", animation);
      }
    };


    // Attach listeners
    socket.on("updateUsers", handleUpdateUsers);
    socket.on("updateRooms", handleUpdateRooms);
    socket.on("launchRoom", handleLaunchRoom);
    socket.on("updateGame", handleUpdateGame);
    socket.on("triggerSoundForAll", handleTriggerSound);
    socket.on("triggerAnimationForAll", handleTriggerAnimation);

    return () => {
      socket.disconnect();
    };
  }, [socket]); // Only re-run if socket instance changes

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
        isDev,
        setIsDev,
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
