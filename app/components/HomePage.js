"use client";

import React, { useState } from "react";
import PlayersGrid from "./PlayersGrid";
import { Button } from "@nextui-org/react";
import RolesGrid from "./RolesGrid";
import GameArea from "./GameArea";

const HomePage = () => {
  const [playerName, setPlayerName] = useState("");
  const [showPlayersGrid, setShowPlayersGrid] = useState(false);
  const [gameLaunched, setGameLaunched] = useState(false);

  const handleNameSubmit = () => {
  };

  const launchGame = () => {
    setShowPlayersGrid(true);
    setGameLaunched(true);
  };  

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-4xl font-bold my-4">Welcome to Wolvesville Game</h1>
      <label>Your name:</label>
      <input
        type="text"
        value={playerName}
        onChange={(e) => setPlayerName(e.target.value)}
      />
      <Button color="primary" onClick={handleNameSubmit}>Submit</Button>

      <Button className="my-2" color="primary" onClick={(() => launchGame())}>Launch a Game</Button>
      
      {gameLaunched && <GameArea playerName={playerName} /> }
            
      <RolesGrid />

    </main>
  );
};

export default HomePage;
