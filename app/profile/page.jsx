"use client"

import ProfileCard from "../components/Profile/ProfileCard";
import Connexion from "../components/Home/Connexion";
import GamePage from "../components/Game/GamePage";
import { useAuth } from "../providers/AuthProvider";

export default function ProfilePage() {
  const { isConnected, isInRoom } = useAuth();

  return (
    <div>
      {isConnected ? (
        <>
          {
            isInRoom ? (
              <GamePage />
            ) : (
              <section className="flex justify-center items-center">
                <ProfileCard />
              </section>
            )
          }
        </>
      ) : (
        <Connexion />
      )
      }
    </div>
  );
};