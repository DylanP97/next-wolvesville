"use client"

import ConnectedUsers from "./ConnectedUsers";
import Connexion from "../components/Connexion";
import { useAuth } from "../providers/AuthProvider";
import { redirect } from "next/navigation";

export default function ConnectedUsersPage() {
  const { isConnected, isInRoom, isPlaying } = useAuth();

  if (isConnected && isInRoom && isPlaying) return redirect("/game");

  return (
    <>
      {isConnected ? (
        <ConnectedUsers />
      ) : (
        <Connexion />
      )}
    </>
  );
}