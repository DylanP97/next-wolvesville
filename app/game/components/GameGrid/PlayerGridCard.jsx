"use client";

import Image from "next/image";
import VoteCount from "./VoteCount";
import IconReveal from "./IconReveal";
import PlayerAvatar from "./PlayerAvatar";
import { useGame } from "../../providers/GameProvider";

const PlayerGridCard = ({
  player,
  selectedPlayer1,
  isAlsoWolf,
  handlePlayerClick,
}) => {
  const {
    timeOfTheDay,
    clientPlayer,
    isWolf,
    isSelection,
    isDoubleSelection,
    isBlocked,
  } = useGame();

  return (
    <div
      key={"plycard-" + player.id}
      onClick={() => handlePlayerClick(player)}
      className={`${
        player.isAlive
          ? clientPlayer.id !== player.id
            ? (isSelection ||
                (isDoubleSelection &&
                  player.id !== (selectedPlayer1 && selectedPlayer1.id))) &&
              !isBlocked &&
              ((isWolf && !isAlsoWolf) || !isWolf)
              ? "bg-red-800 cursor-pointer animate-pulse"
              : "bg-slate-800"
            : "bg-slate-500"
          : "bg-[#303030]"
      } w-full md:w-40 h-full md:h-full flex flex-col justify-center items-center relative p-2`}
    >
      {timeOfTheDay == "votetime" && <VoteCount voteNbr={player.voteAgainst} />}

      {timeOfTheDay == "nighttime" && isWolf && !clientPlayer.isUnderArrest && (
        <VoteCount voteNbr={player.wolfVoteAgainst} />
      )}

      {((clientPlayer.role.name == "Cupid" && player.isInLove) ||
        (clientPlayer.isInLove && player.isInLove)) && (
        <div className="absolute bottom-0 left-0 m-2 h-6 aspect-square flex justify-center items-center animate-pulse">
          <Image
            src="https://res.cloudinary.com/dnhq4fcyp/image/upload/v1706531451/selection/resuscitation_tqyfkl.png"
            alt="lover"
            width={60}
            height={60}
          />
        </div>
      )}

      {(player.isRevealed ||
        player.id == clientPlayer.id ||
        (isAlsoWolf && isWolf)) && <IconReveal roleIcon={player.role.image} />}

      <PlayerAvatar
        isAlive={player.isAlive}
        isUnderArrest={player.isUnderArrest}
        avatar={player.avatar}
      />

      <p
        className={`${
          isSelection && player.id !== clientPlayer.id
            ? "text-black"
            : "text-white"
        } text-xs mt-2`}
      >
        {player.name}
      </p>
    </div>
  );
};

export default PlayerGridCard;
