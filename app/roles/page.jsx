"use client"

import RolesGrid from "./components/RolesGrid"
import Connexion from "../components/Connexion";
import { useAuth } from "../providers/AuthProvider";
import { redirect } from "next/navigation";

export default function RolePage() {
  const { isConnected, isInRoom, isPlaying} = useAuth();

  if (isConnected && isInRoom && isPlaying) return redirect("/game");

  return (
    <div>
      {isConnected ? (
        <RolesGrid />
      ) : (
        <Connexion />
      )}
    </div>
  )
}