"use client";

import { Button, Input } from "@nextui-org/react";

const SelectNumberOfPlayers = ({
  setStep,
  setNbrOfPlayers,
  nbrOfPlayers,
  setPlayersList,
}) => {
  class Player {
    constructor(id, name, avatar, role) {
      this.id = id || 0;
      this.name = name || "";
      this.avatar = avatar || "";
      this.role = role || "";
      this.isAlive = true;
      this.isRevealed = false;
      this.voteAgainst = 0;
      this.isUnderArrest = false;
    }
  }

  const submitNumberOfPlayers = () => {
    setNbrOfPlayers(nbrOfPlayers);
    for (let i = 0; i < nbrOfPlayers; i++) {
      new Player(i);
      setPlayersList(playersList => [...playersList, new Player(i)]);
    }
    setStep(1);
  };

  return (
    <section className="min-h-screen h-full w-screen p-4">
      <div className="w-60 my-6">
        <Input
          type="number"
          defaultValue={nbrOfPlayers}
          labelPlacement="outside"
          size="lg"
          min={4}
          max={16}
          onChange={(event) => setNbrOfPlayers(Number(event.target.value))}
          endContent={
            <div className="pointer-events-none flex items-center">
              <span className="text-default-400 text-small"> players</span>
            </div>
          }
        />
      </div>
      <Button variant="ghost" color="primary" onClick={() => submitNumberOfPlayers()}>
        Submit Number Of Players
      </Button>
    </section>
  );
};

export default SelectNumberOfPlayers;
