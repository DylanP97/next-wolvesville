"use client"

import ProfileCard from "./Profile/ProfileCard";
import Connexion from "../components/Connexion";
import { useAuth } from "../providers/AuthProvider";
import { redirect } from "next/navigation";

export default function ProfilePage() {
  const { isConnected, isInRoom, isPlaying, username, avatar, socketId } = useAuth();

  if (isConnected && isInRoom && isPlaying) return redirect("/game");

  return (
    <>
      {isConnected ? (
        <ProfileCard username={username} avatar={avatar} socketId={socketId} />
      ) : (
        <Connexion />
      )}
    </>
  );
};