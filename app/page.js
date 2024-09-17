"use client";

import { useEffect, useState } from "react";
import HomePage from "./homepage/HomePage";
import PreScreenMenu from "./PreScreenMenu";
import { useAuth } from "./providers/AuthProvider";

export default function Home() {
  const { username, isConnected, socketId, isInRoom, isPlaying, avatar } =
    useAuth();
  const [activeComponent, setActiveComponent] = useState(null);

  useEffect(() => {
    if (!isConnected) {
      setActiveComponent(<PreScreenMenu />);
    } else if (isInRoom && isPlaying) {
      // Redirect or set active component for the game
      // setActiveComponent(<Game />); or handle redirection here
    } else {
      setActiveComponent(
        <HomePage
          username={username}
          isInRoom={isInRoom}
          avatar={avatar}
          setActiveComponent={setActiveComponent}
        />
      );
    }
  }, [isConnected, isInRoom, isPlaying, username, avatar]);

  return <>{activeComponent}</>;
}
