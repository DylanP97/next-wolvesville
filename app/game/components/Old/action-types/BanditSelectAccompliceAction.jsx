"use client";

import { Kbd } from "@nextui-org/react";
import Action from "../Action";

const BanditSelectAccompliceAction = ({ isSelectionMode, setIsSelectionMode, playerToPlay, setSelectedActionButton }) => { 

  const selectAccompliceAction = () => {
    setSelectedActionButton(2)
    setIsSelectionMode(!isSelectionMode);
  }
  
return (
  <Action
    onClick={() => selectAccompliceAction()}
    label={
      !isSelectionMode ? (
        playerToPlay.role.name === "Bandit" && !playerToPlay.partner ? (
          <>Select an accomplice</>
        ) : (
          playerToPlay.role.canPerform.label
        )
      ) : (
        <>Cancel selection</>
      )
    }
    kbdComponent={<Kbd className="m-2">2</Kbd>}
    bgColor="bg-cyan-600"
    dataname="bandit"
  />
);
  }
export default BanditSelectAccompliceAction;
