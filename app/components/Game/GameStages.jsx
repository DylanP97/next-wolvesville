"use client";

import SelectNumberOfPlayers from "./SelectNumberOfPlayers";
import SelectRolesForGame from "./SelectRolesForGame";
import GameArea from "./GameArea";
import { useState } from "react";

const GameStages = () => {
  const [step, setStep] = useState(0);
  const [nbrOfPlayers, setNbrOfPlayers] = useState(4);
  const [playersList, setPlayersList] = useState([]);

  if (step === 0)
    return (
      <SelectNumberOfPlayers
        setStep={setStep}
        setNbrOfPlayers={setNbrOfPlayers}
        nbrOfPlayers={nbrOfPlayers}
        setPlayersList={setPlayersList}
      />
    );

  if (step === 1)
    return (
      <SelectRolesForGame
        setStep={setStep}
        nbrOfPlayers={nbrOfPlayers}
        playersList={playersList}
        setPlayersList={setPlayersList}
      />
    );

  if (step === 2)
    return <GameArea playersList={playersList} />;
};

export default GameStages;
