"use client";

import AppHeader from "./components/AppHeader";
import HomePage from "./components/Home/HomePage";
import Connexion from "./components/Home/Connexion";
import { useAuth } from "./providers/AuthProvider";
import { redirect } from "next/navigation";

export default function Home() {
  const { username, isConnected, socketId, isInRoom, isPlaying } = useAuth();

  console.log("isInRoom : " + isInRoom)
  console.log("isPlaying : " + isPlaying)
  if (isConnected && isInRoom && isPlaying) return redirect("/game");

  return (
    <div>
      {isConnected ? (
        <>
          <AppHeader username={username} socketId={socketId} />
          <HomePage />
        </>
      ) : (
        <Connexion />
      )}
    </div>
  );
}
