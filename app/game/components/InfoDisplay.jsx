"use client";

import { useState } from "react";
import { useGame } from "../providers/GameProvider";

const InfoDisplay = () => {
  const { isSelection, isDoubleSelection, isBlocked } = useGame();

  const [info, setInfo] = useState();

  isDoubleSelection && setInfo("isDoubleSelection");
  isSelection && setInfo("isSelection");
  isBlocked && setInfo("isBlocked");

  return <p className="text-white text-xs mt-2">{info} active</p>;
};

export default InfoDisplay;
