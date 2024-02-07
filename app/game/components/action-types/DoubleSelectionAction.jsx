"use client"

import Action from "../Action";
import { Kbd } from "@nextui-org/react";

const DoubleSelectionAction = ({ isDoubleSelection, onClick, label }) => (
  <Action
    onClick={onClick}
    label={!isDoubleSelection ? label : "Cancel selection"}
    kbdComponent={<Kbd className="m-2">1</Kbd>}
    bgColor="bg-pink-600"
  />
);

export default DoubleSelectionAction;
