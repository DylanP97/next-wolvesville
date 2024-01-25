"use client"

import Connexion from "../components/Home/Connexion";
import CreateRoom from "../components/Room/CreateRoom";
import { useAuth } from "../providers/AuthProvider";
import { redirect } from "next/navigation";

export default function CreateRoomPage() {
  const { isConnected, isInRoom, isPlaying} = useAuth();

  if (isConnected && isInRoom && isPlaying) return redirect("/game");

  return (
    <div>
      {isConnected ? (
        <CreateRoom />
      ) : (
        <Connexion />
      )}
    </div>
  );
};