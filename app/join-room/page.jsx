"use client"

import Connexion from "../components/Home/Connexion";
import JoinRoom from "../components/Room/JoinRoom";
import { useAuth } from "../providers/AuthProvider";

export default function JoinRoomPage() {
  const { username, isConnected, socketId } = useAuth();

  return (
    <div>
      {isConnected ? (
        <>
          <JoinRoom />;
        </>
      ) : (
        <Connexion />
      )}
    </div>
  );
}