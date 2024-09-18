"use client";

import { createContext, useContext, useEffect, useState } from "react";
import HomePage from "./homepage/HomePage";
import PreScreenMenu from "./PreScreenMenu";
import Game from "./game/Game";
import { useAuth } from "./providers/AuthProvider";

const RenderContext = createContext();

export default function Home() {
  const { username, isConnected, isInRoom, isPlaying, avatar } = useAuth();
  const [activeComponent, setActiveComponent] = useState(null);

  useEffect(() => {
    if (!isConnected) {
      setActiveComponent(<PreScreenMenu />);
    } else if (isInRoom && isPlaying) {
      setActiveComponent(<Game />);
    } else {
      setActiveComponent(
        <HomePage
          username={username}
          isInRoom={isInRoom}
          avatar={avatar}
          setActiveComponent={setActiveComponent}
          activeComponent={activeComponent}
        />
      );
    }
  }, [isConnected, isInRoom, isPlaying, username, avatar]);

  return (
    <RenderContext.Provider
      value={{
        activeComponent,
        setActiveComponent,
      }}
    >
      {activeComponent}
    </RenderContext.Provider>
  );
}

export const useToRender = () => {
  const context = useContext(RenderContext);

  if (!context) {
    throw new Error("useToRender must be used within an RenderContext");
  }

  return context;
};
