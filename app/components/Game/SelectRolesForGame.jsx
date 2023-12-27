"use client";

import characters from "@/app/lib/characters";
import { Button } from "@nextui-org/react";
import { CheckboxGroup, Checkbox } from "@nextui-org/react";
import { useState } from "react";
import { shuffle } from "lodash";
import { giveRandomName } from "@/app/lib/gameActions";

const SelectRolesForGame = ({ setStep, nbrOfPlayers, playersList, setPlayersList }) => {
  const [selectedRoles, setSelectedRoles] = useState([]);

  const submitSelectedRoles = () => {
    if (selectedRoles.length !== nbrOfPlayers) {
      alert(`You must select ${nbrOfPlayers} roles`);
    } else {
      const shuffledRoles = shuffle(selectedRoles);
      setPlayersList(
        playersList.map((player, index) => {
          player.role = shuffledRoles[index];
          player.name = giveRandomName();
          return player;
        })
      );
    }
    setStep(2);
  };

  return (
    <section className="min-h-screen h-full w-screen p-4">
      <p className="text-lg text-center text-white">Choose {nbrOfPlayers} roles</p>
      <CheckboxGroup
        className="my-4"
        label={`Select ${nbrOfPlayers} roles`}
        defaultValue={["Villager", "Alpha Werewolf"]}
        value={selectedRoles}
        onValueChange={setSelectedRoles}>
        {characters.map((character, index) => {
          if (character.name !== "Accomplice")
            return (
              <Checkbox key={character.name} value={character}>
                <span className="text-white">
                  {character.name} {" ("}{character.team.join(', ')}{") "}
                </span>
              </Checkbox>
            );
        })}
      </CheckboxGroup>
      {selectedRoles.length === nbrOfPlayers && (
        <Button variant="ghost" color="secondary" onClick={() => submitSelectedRoles()}>
          Submit Selected Roles
        </Button>
      )}
    </section>
  );
};

export default SelectRolesForGame;
