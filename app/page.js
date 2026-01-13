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

    console.log(`🎯 Routing decision: isConnected=${isConnected}, isInRoom=${isInRoom}, isPlaying=${isPlaying}`);

    if (!isConnected) {
      console.log(`→ Showing PreScreenMenu (not connected)`);
      setActiveComponent(<PreScreenMenu />);
    } else if (isInRoom && isPlaying) {
      console.log(`→ Showing Game (isInRoom=${isInRoom} AND isPlaying=${isPlaying})`);
      setActiveComponent(<Game />);
    } else {
      console.log(`→ Showing HomePage (isInRoom=${isInRoom} OR isPlaying=${isPlaying} is false)`);
      setActiveComponent(
        <HomePage username={username} isPlaying={isPlaying} isInRoom={isInRoom} avatar={avatar} />
      );
    }
  }, [isConnected, isInRoom, isPlaying, mounted]);

  if (!mounted) {
    return null;
  }

  return <div className="flex flex-grow">{activeComponent}</div>;
}
