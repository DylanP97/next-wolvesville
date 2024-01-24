"use client"

import RolesGrid from "../components/Roles/RolesGrid"
import Connexion from "../components/Home/Connexion";
import GamePage from "../components/Game/GamePage";
import { useAuth } from "../providers/AuthProvider";

export default function RolePage() {
  const { isConnected, isInAGame } = useAuth();

  return (
    <div>
      {isConnected ? (
        <>
          {
            isInAGame ? (
              <GamePage />
            ) : (
              <RolesGrid />
            )
          }
        </>
      ) : (
        <Connexion />
      )}
    </div>
  )
}