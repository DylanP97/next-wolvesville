"use client"

import Connexion from "../components/Connexion";
import JoinRoom from "./JoinRoom";
import { useAuth } from "../providers/AuthProvider";
import { redirect } from "next/navigation";

export default function JoinRoomPage() {
  const { isConnected, isInRoom, isPlaying} = useAuth();

  if (isConnected && isInRoom && isPlaying) return redirect("/game");

  return (
    <div>
      {isConnected ? (
        <JoinRoom />
      ) : (
        <Connexion />
      )}
    </div>
  );
}