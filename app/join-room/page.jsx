"use client"

import Connexion from "../connexion/Connexion";
import JoinRoom from "./JoinRoom";
import { useAuth } from "../providers/AuthProvider";
import { redirect } from "next/navigation";

export default function JoinRoomPage() {
  const { isConnected, isInRoom, isPlaying} = useAuth();

  if (isConnected && isInRoom && isPlaying) return redirect("/game");

  return (
    <>
      {isConnected ? (
        <JoinRoom />
      ) : (
        <Connexion />
      )}
    </>
  );
}