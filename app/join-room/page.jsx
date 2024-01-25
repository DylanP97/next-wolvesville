"use client"

import Connexion from "../components/Home/Connexion";
import JoinRoom from "../components/Room/JoinRoom";
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