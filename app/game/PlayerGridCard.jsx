"use client";

import Image from "next/image";
import VoteCount from "./VoteCount";
import IconReveal from "./IconReveal";
import PlayerAvatar from "./PlayerAvatar";
import { useGame } from "./GameProvider";
import {
  getPlyCardBackground,
  getPlyCardLayout,
} from "./getPlyCardStyles";

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

  const onClickHandler = () => {
    handleClick(player);
  };

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
        (isAlsoWolf && isWolf)) && <IconReveal roleIcon={player.role.image} />}

      <PlayerAvatar
        isAlive={player.isAlive}
        isUnderArrest={player.isUnderArrest}
        avatar={player.avatar}
      />

      <p className="text-xs">{player.name}</p>
    </div>
  );
};

export default PlayerGridCard;
