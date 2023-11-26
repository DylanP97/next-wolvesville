"use client";

import { Kbd } from "@nextui-org/react";
import Action from "../Action";

const ActionSetter = ({
  label,
  needSelection,
  setIsSelectionMode,
  isSelectionMode,
  registerSimpleAction,
  registeredActions,
  setRegisteredActions,
  dataname,
  playerToPlay,
  toNext,
}) => (
  <Action
    onClick={() => {
      needSelection
        ? setIsSelectionMode(!isSelectionMode)
        : registerSimpleAction(registeredActions, setRegisteredActions, playerToPlay, toNext);
    }}
    label={!isSelectionMode ? label : "Cancel selection"}
    kbdComponent={<Kbd className="m-2">1</Kbd>}
    bgColor="bg-blue-700"
    dataname={dataname}
  />
);

export default ActionSetter;
