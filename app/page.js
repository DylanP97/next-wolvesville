"use client";

import PreScreenMenu from "./PreScreenMenu";
import { useToRender } from "./providers/RenderProvider";
import { useAuth } from "./providers/AuthProvider";
import HomePage from "./homepage/HomePage";
import Game from "./game/Game";
import { useEffect } from "react";

export default function Page() {
  const { username, isConnected, isInRoom, isPlaying, avatar } = useAuth();
  const { activeComponent, setActiveComponent } = useToRender();

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
        />
      );
    }
  }, [isConnected, isInRoom, isPlaying]);

  return <div className="flex-grow">{activeComponent}</div>;
}
