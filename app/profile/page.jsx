"use client";

import Profile from "./components/Profile";
import Connexion from "../connexion/Connexion";
import { useAuth } from "../providers/AuthProvider";
import { redirect } from "next/navigation";

export default function ProfilePage() {
  const {
    isConnected,
    isInRoom,
    isPlaying,
    username,
    avatar,
    socketId,
    isGuest,
  } = useAuth();

  if (isConnected && isInRoom && isPlaying) return redirect("/game");
  if (isGuest) return redirect("/");

  return (
    <>
      {isConnected ? (
        <Profile username={username} avatar={avatar} socketId={socketId} />
      ) : (
        <Connexion />
      )}
    </>
  );
}
