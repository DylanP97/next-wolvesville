"use client"

import RolesGrid from "../components/Roles/RolesGrid"
import Connexion from "../components/Home/Connexion";
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