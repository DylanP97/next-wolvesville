"use client";

import PreScreenMenu from "./PreScreenMenu";
import { useToRender } from "./providers/RenderProvider";
import { useAuth } from "./providers/AuthProvider";
import HomePage from "./homepage/HomePage";
import Game from "./game/Game";
import { useEffect, useState } from "react";

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export default function Page() {
  const { username, isConnected, isInRoom, isPlaying, avatar } = useAuth();
  const { activeComponent, setActiveComponent } = useToRender();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    if (!isConnected) {
      setActiveComponent(<PreScreenMenu />);
    } else if (isInRoom && isPlaying) {
      setActiveComponent(<Game />);
    } else {
      setActiveComponent(
        <HomePage username={username} isInRoom={isInRoom} avatar={avatar} />
      );
    }
  }, [isConnected, isInRoom, isPlaying, mounted]);

  if (!mounted) {
    return null;
  }

  return <div className="flex flex-grow">{activeComponent}</div>;
}
