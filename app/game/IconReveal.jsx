"use client";

import Image from "next/image";

const IconReveal = ({ roleIcon, isRevealed, isWolfTeammate, isDevMode }) => {
  const getBorderColor = () => {
    if (isRevealed) return "border-yellow-500";
    if (isWolfTeammate) return "border-blue-500";
    if (isDevMode) return "border-red-600";
    return "border-yellow-500";
  };

  return (
    <div className={`absolute -top-2 -right-2 w-10 h-10 flex justify-center items-center bg-slate-800 rounded-full border-2 ${getBorderColor()} shadow-lg`}>
      <Image src={roleIcon} width={32} height={32} alt="role" />
    </div>
  );
};

export default IconReveal;
