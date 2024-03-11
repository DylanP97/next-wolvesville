"use client";

import Image from "next/image";
import AvatarUI from "../../../profile/Profile/AvatarUI";

import tombstone from "https://res.cloudinary.com/dnhq4fcyp/image/upload/v1706535348/tombstone_fq163l.png";
import prison from "https://res.cloudinary.com/dnhq4fcyp/image/upload/v1706535348/prison_dpuqr4.png";
import voteAgainstIcon from "https://res.cloudinary.com/dnhq4fcyp/image/upload/v1706531453/selection/vote-against-icon_mgkchv.png";
import spilled from "https://res.cloudinary.com/dnhq4fcyp/image/upload/v1706535328/spilled_tsishg.png";
import accomplice from "https://res.cloudinary.com/dnhq4fcyp/image/upload/v1706531395/roles/accomplice_kfsf0u.png";

const PlayerCardImage = ({
  timeOfTheDay,
  player,
  playerToPlay,
  isDoubleSelection,
  isSelectionMode,
  selectedActionButton,
}) => {
  const checkIfAlreadyPouredWithGasoline = () => {
    const isPoured = playerToPlay.role.playersToSetOnFire.some((pouredPlayer) => player.id === pouredPlayer.id);
    return !isPoured;
  };

  return (
    <>
      {!player.isAlive ? (
        <Image className="absolute" width={60} height={60} src={tombstone} alt="role" />
      ) : player.isRevealed ? (
        <Image
          width={100}
          height={100}
          src={player.role.image}
          alt="role"
          className={`h-16 w-16 ${isDoubleSelection || isSelectionMode ? "opacity-50" : ""}`}
        />
      ) : (
        <AvatarUI selection={isDoubleSelection || isSelectionMode} />
      )}

      {/* add prison bars */}
      {player.isUnderArrest && <Image className="absolute" width={100} height={100} src={prison} alt="prison" />}

      {/* selection mode ⏬ */}

      {/* add votetime finger pointing image */}
      {player.id !== playerToPlay.id && player.isAlive && isSelectionMode && timeOfTheDay === "votetime" && (
        <Image
          className="absolute z-10 animate-pulse"
          width={50}
          height={50}
          src={voteAgainstIcon}
          alt="voteAgainstIcon"
        />
      )}

      {/* Basic selection action */}
      {player.id !== playerToPlay.id &&
        !player.isUnderArrest &&
        player.isAlive &&
        (isSelectionMode || isDoubleSelection) &&
        timeOfTheDay !== "votetime" &&
        playerToPlay.role.name !== "Bandit" &&
        playerToPlay.role.name !== "Pyromaniac" &&
        playerToPlay.role.name !== "Grave Robber" &&
        playerToPlay.role.team.join() !== "werewolves" && (
          <Image
            className="absolute z-10 animate-pulse"
            width={50}
            height={50}
            src={playerToPlay.role.canPerform.emoji.src}
            alt={playerToPlay.role.canPerform.type}
          />
        )}

      {/* The werewolves will select among players that are not werewolves */}
      {player.id !== playerToPlay.id &&
        !player.isUnderArrest &&
        player.isAlive &&
        (isSelectionMode || isDoubleSelection) &&
        timeOfTheDay === "nighttime" &&
        player.role.team.join() !== "werewolves" &&
        playerToPlay.role.team.join() === "werewolves" && (
          <Image
            className="absolute z-10 animate-pulse"
            width={50}
            height={50}
            src={playerToPlay.role.canPerform.emoji.src}
            alt={playerToPlay.role.canPerform.type}
          />
        )}

      {/* The bandit will select either its accomplice or someone to kill */}
      {player.id !== playerToPlay.id &&
        player.isAlive &&
        (isSelectionMode || isDoubleSelection) &&
        timeOfTheDay !== "votetime" &&
        playerToPlay.role.name === "Bandit" && (
          <Image
            className="absolute z-10 animate-pulse"
            width={50}
            height={50}
            src={selectedActionButton !== 2 ? playerToPlay.role.canPerform.emoji.src : accomplice}
            alt={playerToPlay.role.canPerform.type}
          />
        )}

      {/* The Pyro will select among players that aren't already poured with gasoline */}
      {player.id !== playerToPlay.id &&
        player.isAlive &&
        !player.isUnderArrest &&
        (isSelectionMode || isDoubleSelection) &&
        timeOfTheDay !== "votetime" &&
        playerToPlay.role.name === "Pyromaniac" && (
          <Image
            className={`${checkIfAlreadyPouredWithGasoline() ? "animate-pulse" : "animate-none"} absolute z-10`}
            width={60}
            height={60}
            src={checkIfAlreadyPouredWithGasoline() ? playerToPlay.role.canPerform.emoji.src : spilled}
            alt={playerToPlay.role.canPerform.type}
          />
        )}

      {/* The Grave Robber will select among the dead players */}
      {player.id !== playerToPlay.id &&
        !player.isAlive &&
        (isSelectionMode || isDoubleSelection) &&
        timeOfTheDay === "nighttime" &&
        playerToPlay.role.name === "Grave Robber" && (
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
