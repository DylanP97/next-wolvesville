"use client";

import HomePage from "./components/HomePage";
import Connexion from "./components/Connexion";
import { useAuth } from "./providers/AuthProvider";
import { redirect } from "next/navigation";
import werewolf from "../public/game/wolf4.png"
import { Image } from "@nextui-org/react";

export default function Home() {
  const { username, isConnected, socketId, isInRoom, isPlaying, avatar } = useAuth();

  if (isConnected && isInRoom && isPlaying) return redirect("/game");

  return (
    <>
      {isConnected ? (
        <HomePage username={username} socketId={socketId} isInRoom={isInRoom} avatar={avatar} />
      ) : (
        <Connexion />
      )}
    </>
  );
}
