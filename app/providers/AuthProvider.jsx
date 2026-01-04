"use client";

import { createContext, useContext, useState, useEffect } from "react";
import io from "socket.io-client";
import { useSound } from "./SoundProvider";
import { useAnimation } from "./AnimationProvider";
import animationsData from "../lib/animations";

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
  const [cardAnimationQueue, setCardAnimationQueue] = useState([]);

  const {
    generateNoise,
    generateBackgroundMusic,
    stopMusic,
  } = useSound();

  const { triggerAnimation } = useAnimation();

  const updateUserGameState = (newIsInRoom, newIsPlaying) => {
    setIsInRoom(newIsInRoom);
    setIsPlaying(newIsPlaying);
    // setGame(newGame);
    // console.log("called??")
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
      setIsDev(data.isDev);
      const newSocket = io(process.env.NEXT_PUBLIC_API_URL, {
        query: { token: data.token },
      });
      setSocket(newSocket);
    } else {
      // console.log("User is not authenticated");
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

    // Define all handlers first (for clarity and to enable off())
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
      triggerAnimation(animation);
    };

    const handleTriggerCardAnimation = (cardAnimation) => {
      const animation = animationsData.find((a) => a.title === cardAnimation.title);
      if (!animation) {
        console.warn("Card animation title not found:", cardAnimation.title);
        return;
      }

      const duration = animation.ms || 3000;

      const newQueueItem = {
        id: Date.now() + Math.random(),
        path: animation.path,
        cardsPlyIds: cardAnimation.cardsPlyIds || [],
      };

      // Add to queue
      setCardAnimationQueue(prev => [...prev, newQueueItem]);

      // Auto-remove this exact item after its duration
      setTimeout(() => {
        setCardAnimationQueue(prev =>
          prev.filter(item => item.id !== newQueueItem.id)
        );
      }, duration + 100); // small buffer for safety
    };

    // Attach listeners
    socket.on("updateUsers", handleUpdateUsers);
    socket.on("updateRooms", handleUpdateRooms);
    socket.on("launchRoom", handleLaunchRoom);
    socket.on("updateGame", handleUpdateGame);
    socket.on("triggerSoundForAll", handleTriggerSound);
    socket.on("triggerAnimationForAll", handleTriggerAnimation);
    socket.on("triggerCardAnimationForAll", handleTriggerCardAnimation);

    // Cleanup: remove ALL listeners when socket changes or unmounts
    return () => {
      socket.off("updateUsers", handleUpdateUsers);
      socket.off("updateRooms", handleUpdateRooms);
      socket.off("launchRoom", handleLaunchRoom);
      socket.off("updateGame", handleUpdateGame);
      socket.off("triggerSoundForAll", handleTriggerSound);
      socket.off("triggerAnimationForAll", handleTriggerAnimation);
      socket.off("triggerCardAnimationForAll", handleTriggerCardAnimation);
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
        cardAnimationQueue,
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
