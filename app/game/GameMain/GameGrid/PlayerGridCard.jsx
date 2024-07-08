"use client";

import Image from "next/image";
import VoteCount from "./PlayerGridCard/VoteCount";
import IconReveal from "./PlayerGridCard/IconReveal";
import PlayerAvatar from "./PlayerGridCard/PlayerAvatar";
import { useGame } from "../../providers/GameProvider";
import getPlyCardStyles from "./PlayerGridCard/getPlyCardStyles";

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
      className={`${getPlyCardStyles(
        player,
        clientPlayer,
        isSelection,
        isDoubleSelection,
        selectedPlayer,
        selectedPlayer1,
        isBlocked,
        isWolf,
        isAlsoWolf,
        actionType,
        weather,
        timeOfTheDay
      )} w-full h-20 flex flex-col justify-center items-center relative p-2`}
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

      <p className="text-xs mt-2">{player.name}</p>
    </div>
  );
};

export default PlayerGridCard;
