"use client";

import Image from "next/image";
import { useDevMode } from "../providers/DevModeProvider";

const IconReveal = ({ roleIcon, isRevealed }) => {
  const { isDevMode } = useDevMode();

  return (
    <div className={`absolute -top-2 -right-2 w-10 h-10 flex justify-center items-center bg-slate-800 rounded-full border-2 ${isRevealed ? "border-yellow-500" : "border-red-600"} shadow-lg`}>
      <Image src={roleIcon} width={32} height={32} alt="role" />
    </div>
  );
};

export default IconReveal;
