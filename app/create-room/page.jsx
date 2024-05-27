"use client"

import Connexion from "../components/Connexion";
import CreateRoom from "./CreateRoom";
import { useAuth } from "../providers/AuthProvider";
import { redirect } from "next/navigation";

export default function CreateRoomPage() {
  const { isConnected, isInRoom, isPlaying} = useAuth();

  if (isConnected && isInRoom && isPlaying) return redirect("/game");

  return (
    <>
      {isConnected ? (
        <CreateRoom />
      ) : (
        <Connexion />
      )}
    </>
  );
};