"use client";

import React, { useState } from "react";
import PlayersGrid from "./PlayersGrid";
import { Button, Link } from "@nextui-org/react";
import RolesGrid from "./RolesGrid";
import GameArea from "./GameArea";

const HomePage = () => {
  const [playerName, setPlayerName] = useState("");
  const [showPlayersGrid, setShowPlayersGrid] = useState(false);
  const [gameLaunched, setGameLaunched] = useState(false);

  const handleNameSubmit = () => {};

  const launchGame = () => {
    setShowPlayersGrid(true);
    setGameLaunched(true);
  };

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-4xl font-bold my-6">Welcome to Wolvesville 🐺</h1>
      <nav className="flex flex-col">
        <Link className="p-2 m-2 w-52 bg-slate-800 hover:bg-slate-900 hover:outline-double outline-red-800 rounded-xl" href="/game" color="foreground">
          New Game
        </Link>
        <Link className="p-2 m-2 w-52 bg-slate-800 hover:bg-slate-900 hover:outline-double outline-red-800 rounded-xl" href="/roles" color="foreground">
          Roles
        </Link>
        <Link className="p-2 m-2 w-52 bg-slate-800 hover:bg-slate-900 hover:outline-double outline-red-800 rounded-xl" href="/" color="foreground">
          More
        </Link>
        <Link className="p-2 m-2 w-52 bg-slate-800 hover:bg-slate-900 hover:outline-double outline-red-800 rounded-xl" href="/" color="foreground">
          About
        </Link>
      </nav>
    </div>
  );
};

export default HomePage;
