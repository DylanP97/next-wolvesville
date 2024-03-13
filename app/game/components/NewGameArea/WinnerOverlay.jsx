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

  console.log(winningTeam)

  return (
    <div
      className="winner-overlay"
      style={{
        zIndex: 999,
      }}>
      <div className="winner-message flex flex-col justify-center align-center">
        <Image src={winningTeam.image} alt="winner" height={200} width={200} className="m-4" />
        <p>The {winningTeam.name} won!</p>
        <div className="flex flex-col justify-center">
          {
            winningTeam.alivePlayers.map((p) => {
              <div key={p.name + 'key-win-div'} className="flex flex-row items-center">
                <p>{p.name} as </p>
                <Image
                  src={p.role.image}
                  alt={p.role.name + "win-icon-76678"}
                  height={100}
                  width={100}
                  style={{ height: "auto", width: "auto" }}
                  className="h-12 w-12"
                />
              </div>
            })
          }
        </div>
        <Button className="mt-6" color="secondary" variant="ghost" onClick={() => handleExitGame()}>
          Go Back
        </Button>
      </div>
    </div>
  );
};

export default WinnerOverlay;
