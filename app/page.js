"use client";

import HomePage from "./homepage/HomePage";
import Connexion from "./connexion/Connexion";
import { useAuth } from "./providers/AuthProvider";
import { redirect } from "next/navigation";

export default function Home() {
  const { username, isConnected, socketId, isInRoom, isPlaying, avatar } =
    useAuth();

  if (isConnected && isInRoom && isPlaying) return redirect("/game");

  return (
    <>
      {isConnected ? (
        <HomePage
          username={username}
          socketId={socketId}
          isInRoom={isInRoom}
          avatar={avatar}
        />
      ) : (
        <Connexion />
      )}
    </>
  );
}
