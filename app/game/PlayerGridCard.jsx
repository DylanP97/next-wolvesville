"use client";

import Image from "next/image";
import VoteCount from "./VoteCount";
import IconReveal from "./IconReveal";
import PlayerAvatar from "./PlayerAvatar";
import ActionSet from "./ActionSet"
import { useGame } from "./GameProvider";
import { getPlyCardBackground, getPlyCardLayout } from "./getPlyCardStyles";
import { useDevMode } from "../providers/DevModeProvider";
import i18n from "../lib/i18n";
import { useAuth } from "../providers/AuthProvider";

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
    selectionState,
    weather,
  } = useGame();
  const { isDevMode } = useDevMode();
  const { isDev } = useAuth();

  const onClickHandler = () => {
    handleClick(player);
  };

  // Pass these to getPlyCardBackground:
  const { mode, actionType, actionEmoji } = selectionState;
  const isSelection = mode === 'single';
  const isDoubleSelection = mode === 'double';
  const isBlocked = mode === 'completed';

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
      {timeOfTheDay == "votetime" && player.isAlive && <VoteCount voteNbr={player.voteAgainst} isWolfVote={false} />}

      {timeOfTheDay == "nighttime" && isWolf && !clientPlayer.isUnderArrest && !isAlsoWolf && player.isAlive && (
        <VoteCount voteNbr={player.wolfVoteAgainst} isWolfVote={true} />
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
        (player.isRevealedByWolfSeer && isWolf) ||
        isDevMode && isDev) && (
          <IconReveal
            playerId={player.id}
            clientPlayerId={clientPlayer.id}
            roleIcon={player.role.image}
            isRevealed={player.isRevealed}
            isWolfTeammate={(isAlsoWolf && isWolf) || (player.isRevealedByWolfSeer && isWolf)}
            isDevMode={isDevMode}
            isDev={isDev}
          />
        )}

      {
        player.id === (selectedPlayer || selectedPlayer1) && <ActionSet />
      }

      <PlayerAvatar
        isAlive={player.isAlive}
        isUnderArrest={player.isUnderArrest}
        avatar={player.avatar}
      />

      <p className="text-xs text-white font-semibold">
        {player.name}
      </p>

    </div>
  );
};

export default PlayerGridCard;
