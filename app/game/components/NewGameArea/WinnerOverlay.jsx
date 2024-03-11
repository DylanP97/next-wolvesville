"use client";

import { Button } from "@nextui-org/react";
import Image from "next/image";
import { useAuth } from "../../../providers/AuthProvider";

const WinnerOverlay = ({ winningTeam }) => {
  const { updateGameState } = useAuth();

  const handleExitGame = () => {
    updateGameState(null, false, null);
    document.location.assign('/')
  }

  return (
    <div
      className="winner-overlay"
      style={{
        zIndex: 999,
      }}>
      <div className="winner-message flex flex-col justify-center align-center">
        <Image src={winningTeam.image} alt="winner" height={200} width={200} className="m-4" />
        <p>The {winningTeam.name} won!</p>
        <Button className="mt-6" color="secondary" variant="ghost" onClick={() => handleExitGame()}>
          Go Back
        </Button>
      </div>
    </div>
  );
};

export default WinnerOverlay;
