"use client";

import Image from "next/image";
import AvatarUI from "../Profile/AvatarUI";
import tombstone from "@/public/game/tombstone.png";
import prison from "@/public/game/prison.png";
import forefinger from "@/public/game/forefinger.png";

const PlayerCardImage = ({
    timeOfTheDay,
    player,
    playerToPlay,
    isDoubleSelection,
    isSelectionMode,
}) => {
  return (
    <>
      {!player.isAlive ? (
        <Image
          className="absolute"
          width={60}
          height={60}
          src={tombstone}
          alt="role"
        />
      ) : player.isRevealed ? (
        <Image
          width={60}
          height={60}
          src={player.role.image && player.role.image.src}
          alt="role"
          className={isDoubleSelection || isSelectionMode ? "opacity-50" : ""}
        />
      ) : (
        <AvatarUI selection={isDoubleSelection || isSelectionMode} />
      )}

      {player.isUnderArrest && (
        <>
          <Image
            className="absolute"
            width={100}
            height={100}
            src={prison}
            alt="prison"
          />
        </>
      )}

      {player.id !== playerToPlay.id &&
        player.isAlive &&
        isSelectionMode &&
        timeOfTheDay === "votetime" && (
          <Image
            className="absolute z-10 animate-pulse"
            width={50}
            height={50}
            src={forefinger}
            alt="forefinger"
          />
        )}
      {player.id !== playerToPlay.id &&
        player.isAlive &&
        (isSelectionMode || isDoubleSelection) &&
        timeOfTheDay !== "votetime" && (
          <Image
            className="absolute z-10 animate-pulse"
            width={50}
            height={50}
            src={playerToPlay.role.canPerform.emoji.src}
            alt={playerToPlay.role.canPerform.type}
          />
        )}
    </>
  );
};

export default PlayerCardImage;
