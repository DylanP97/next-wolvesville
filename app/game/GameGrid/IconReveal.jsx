"use client";

import Image from "next/image";

const IconReveal = ({ playerId, clientPlayerId, roleIcon, roleEmoji, isRevealed, isWolfTeammate, isDevMode, isDev }) => {
  const getBorderColor = () => {
    if (playerId === clientPlayerId) return "border-gray-500";
    if (isWolfTeammate) return "border-blue-500";
    if (isRevealed) return "bg-yellow-800";
    if (isDevMode && isDev) return "border-red-600";
    return "border-green-500";
  };

  const getBackgroundColor = () => {
    if (isRevealed) return "bg-yellow-800";
    return "bg-slate-800";
  };

  return (
    <div className={`absolute -top-2 -right-2 w-8 md:w-10 h-8 md:h-10 flex justify-center items-center ${getBackgroundColor()} rounded-full border-2 ${getBorderColor()} shadow-lg z-20`}>
      {/* <span className="text-md md:text-sm">{roleEmoji}</span> */}
      <Image src={roleIcon} width={28} height={28} alt="role" />
    </div>
  );
};

export default IconReveal;
