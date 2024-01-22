"use client"

import Connexion from "../components/Home/Connexion";
import ConnectedUsers from "../components/Room/ConnectedUsers";
import { useAuth } from "../providers/AuthProvider";

export default function ConnectedUsersPage() {
  const { username, isConnected, socketId } = useAuth();

  return (
    <div>
      {isConnected ? (
        <>
          <ConnectedUsers />;
        </>
      ) : (
        <Connexion />
      )}
    </div>
  );
}