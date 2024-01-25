"use client"

import ConnectedUsers from "../components/Room/ConnectedUsers";
import Connexion from "../components/Home/Connexion";
import { useAuth } from "../providers/AuthProvider";
import { redirect } from "next/navigation";

export default function ConnectedUsersPage() {
  const { isConnected, isInRoom, isPlaying} = useAuth();

  if (isConnected && isInRoom && isPlaying) return redirect("/game");

  return (
    <div>
      {isConnected ? (
        <ConnectedUsers />
      ) : (
        <Connexion />
      )}
    </div>
  );
}