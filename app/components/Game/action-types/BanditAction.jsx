"use client";

import { Kbd } from "@nextui-org/react";
import Action from "../Action";

const BanditAction = ({ isSelectionMode, setIsSelectionMode, registerSimpleAction, playerToPlay }) => (
  <Action
    onClick={() => {
      playerToPlay.role.name === "Bandit" && !playerToPlay.partner
        ? setIsSelectionMode(!isSelectionMode)
        : registerSimpleAction();
    }}
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
    kbdComponent={<Kbd className="m-2">1</Kbd>}
    bgColor="cyan-600"
    dataname="bandit"
  />
);

export default BanditAction;
