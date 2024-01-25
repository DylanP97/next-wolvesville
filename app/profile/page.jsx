"use client"

import ProfileCard from "../components/Profile/ProfileCard";
import Connexion from "../components/Home/Connexion";
import { useAuth } from "../providers/AuthProvider";
import { redirect } from "next/navigation";

export default function ProfilePage() {
  const { isConnected, isInRoom, isPlaying} = useAuth();

  if (isConnected && isInRoom && isPlaying) return redirect("/game");

  return (
    <div>
      {isConnected ? (
        <section className="flex justify-center items-center">
          <ProfileCard />
        </section>
      ) : (
        <Connexion />
      )
      }
    </div>
  );
};