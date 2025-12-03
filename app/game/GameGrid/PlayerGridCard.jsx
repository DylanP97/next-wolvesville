"use client";

import Image from "next/image";
import VoteCount from "./VoteCount";
import VotingAgainst from "./VotingAgainst";
import IconReveal from "./IconReveal";
import PlayerAvatar from "./PlayerAvatar";
import ActionSet from "./ActionSet"
import { useGame } from "../GameProvider";
import { getPlyCardBackground, getPlyCardLayout } from "./getPlyCardStyles";
import { useDevMode } from "../../providers/DevModeProvider";
import i18n from "../../lib/i18n";
import { useAuth } from "../../providers/AuthProvider";
import prison from "../../../public/game/prison.png";

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

      <p className="text-[8px] md:text-[10px] text-white">
        {player.name}
      </p>

      {timeOfTheDay == "votetime" && player.isAlive && <VoteCount voteNbr={player.voteAgainst} isWolfVote={false} />}

      {timeOfTheDay == "nighttime" && isWolf && !clientPlayer.isUnderArrest && !isAlsoWolf && player.isAlive && (
        <VoteCount voteNbr={player.wolfVoteAgainst} isWolfVote={true} />
      )}
      {timeOfTheDay == "votetime" && player.isAlive && <VotingAgainst hasVotedFor={player.hasVotedFor} />}

      {timeOfTheDay == "nighttime" && isWolf && !clientPlayer.isUnderArrest && isAlsoWolf && player.isAlive && (
        <VotingAgainst hasVotedFor={player.hasWolfVotedFor} />
      )}

      {/* {((clientPlayer.role.name == "Cupid" && player.isInLove) ||
        (clientPlayer.isInLove && player.isInLove)) && (
          <div className="absolute bottom-0 left-0 m-2 h-4 aspect-square flex justify-center items-center animate-pulse">
            <Image
              src="https://res.cloudinary.com/dnhq4fcyp/image/upload/v1706531451/selection/resuscitation_tqyfkl.png"
              alt="lover"
              width={40}
              height={40}
            />
          </div>
        )} */}

      {/* Pyromaniac marked as pour with gasoline */}
      {(clientPlayer.role.name === "Pyromaniac" && player.isMarkedWithGasoline) && (
        <div className="absolute bottom-0 left-0 m-2 h-6 aspect-square flex justify-center items-center">
          <Image
            src="https://res.cloudinary.com/dnhq4fcyp/image/upload/v1706535328/spilled_tsishg.png"
            alt={"gas-marked-" + player.id}
            width={60}
            height={60}
          />
        </div>
      )}

      {player.isUnderArrest && (
        <Image
          className="h-full w-full object-contain overflow-hidden z-30"
          width={64}
          height={64}
          src={prison}
          alt="prison"
        />
      )}

      {
        player.id === (selectedPlayer || selectedPlayer1) && <ActionSet />
      }

      {(player.isRevealed ||
        player.id == clientPlayer.id ||
        (isAlsoWolf && isWolf) ||
        (player.isRevealedByWolfSeer && isWolf) ||
        isDevMode && isDev) && (
          <IconReveal
            playerId={player.id}
            clientPlayerId={clientPlayer.id}
            roleIcon={player.role && player.role.image}
            isRevealed={player.isRevealed}
            isWolfTeammate={(isAlsoWolf && isWolf) || (player.isRevealedByWolfSeer && isWolf)}
            isDevMode={isDevMode}
            isDev={isDev}
          />
        )}


      <div className="absolute w-full bottom-0">


        <PlayerAvatar
          isAlive={player.isAlive}
          avatar={player.avatar}
          inGameAv={true}
        />
      </div>





    </div>
  );
};

export default PlayerGridCard;
