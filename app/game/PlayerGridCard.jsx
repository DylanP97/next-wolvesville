"use client";

import Image from "next/image";
import VoteCount from "./VoteCount";
import IconReveal from "./IconReveal";
import PlayerAvatar from "./PlayerAvatar";
import { useGame } from "./GameProvider";
import { getPlyCardBackground, getPlyCardLayout } from "./getPlyCardStyles";
import { useDevMode } from "../providers/DevModeProvider";
import i18n from "../lib/i18n";

const PlayerGridCard = ({
  player,
  selectedPlayer,
  selectedPlayer1,
  isAlsoWolf,
  handleClick,
}) => {
  const {
    timeOfTheDay,
    clientPlayer,
    isWolf,
    isSelection,
    isDoubleSelection,
    isBlocked,
    weather,
    actionType,
  } = useGame();
  const { isDevMode } = useDevMode();

  const onClickHandler = () => {
    handleClick(player);
  };

  // console.log("player")
  // console.log(player)
  // console.log("player.role")
  // console.log(player.role)
  // console.log("player.role.image")
  // console.log(player.role.name)

  return (
    <div
      key={"plycard-" + player.id}
      onClick={onClickHandler}
      className={`${getPlyCardBackground(
        player,
        selectedPlayer,
        selectedPlayer1,
        isAlsoWolf,
        timeOfTheDay,
        clientPlayer,
        isWolf,
        isSelection,
        isDoubleSelection,
        isBlocked,
        weather,
        actionType
      )} ${getPlyCardLayout()} `}
    >
      {timeOfTheDay == "votetime" && <VoteCount voteNbr={player.voteAgainst} />}

      {timeOfTheDay == "nighttime" && isWolf && !clientPlayer.isUnderArrest && (
        <VoteCount voteNbr={player.wolfVoteAgainst} />
      )}

      {((clientPlayer.role.name == "Cupid" && player.isInLove) ||
        (clientPlayer.isInLove && player.isInLove)) && (
        <div className="absolute bottom-0 left-0 m-2 h-4 aspect-square flex justify-center items-center animate-pulse">
          <Image
            src="https://res.cloudinary.com/dnhq4fcyp/image/upload/v1706531451/selection/resuscitation_tqyfkl.png"
            alt="lover"
            width={40}
            height={40}
          />
        </div>
      )}

      {(player.isRevealed ||
        player.id == clientPlayer.id ||
        (isAlsoWolf && isWolf) ||
        (player.isRevealedByWolfSeer && isWolf)) && <IconReveal roleIcon={player.role.image} />}

      {/* {
        <p className="text-sm text-white ">
          DEV -- {player.isRevealed ? "REVEALED" : "NOT"}
        </p>
      } */}

      <PlayerAvatar
        isAlive={player.isAlive}
        isUnderArrest={player.isUnderArrest}
        avatar={player.avatar}
      />

      <p className="text-xs">
        {player.name}
      </p>
      {isDevMode && (
        <p className="text-xs">
          DEV --{" "}
          {i18n.language === "fr"
            ? player.role.nameFR
            : player.role.name}
        </p>
      )}
    </div>
  );
};

export default PlayerGridCard;
