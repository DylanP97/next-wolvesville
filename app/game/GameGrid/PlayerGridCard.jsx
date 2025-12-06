"use client";

import { useEffect, useState } from "react";
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
import BurnFlameOverlay from "../Overlays/BurnFlameOverlay";

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

  const [showBurnFlame, setShowBurnFlame] = useState(false);
  const [showCardDeathFlash, setShowCardDeathFlash] = useState(false);

  // Show flame for 3 seconds when a player has just been burned by the Arsonist
  useEffect(() => {
    if (timeOfTheDay === "nighttime" && player.wasBurnedByArsonist) {
      setShowBurnFlame(true);
      const timer = setTimeout(() => {
        setShowBurnFlame(false);
      }, 3000);
      return () => clearTimeout(timer);
    } else {
      setShowBurnFlame(false);
    }
  }, [timeOfTheDay, player.wasBurnedByArsonist]);

  // Show card death flash for 3 seconds when a player has just been burned by the Arsonist
  useEffect(() => {
    if (!player.isAlive) {
      setShowCardDeathFlash(true);
      const timer = setTimeout(() => {
        setShowCardDeathFlash(false);
      }, 700);
      return () => clearTimeout(timer);
    } else {
      setShowCardDeathFlash(false);
    }
  }, [player.isAlive]);

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

      <p className={`${timeOfTheDay === "daytime" ? "text-black" : "text-white"}  text-[8px] md:text-[10px]`}>
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

      {/* Show lover icon if:
          - Client is in love and this is their partner, OR
          - Client is Cupid and this player is in love */}
      {((clientPlayer.isInLove && clientPlayer.loverPartnerId === player.id) ||
        (clientPlayer.role.name === "Cupid" && player.isInLove)) && (
          <div className="absolute bottom-0 left-0 m-2 h-4 aspect-square flex justify-center items-center animate-pulse">
            <Image
              src="https://res.cloudinary.com/dnhq4fcyp/image/upload/v1706531451/selection/resuscitation_tqyfkl.png"
              alt="lover"
              width={40}
              height={40}
            />
          </div>
        )}

      {/* Arsonist marked as pour with gasoline */}
      {clientPlayer.role.name === "Arsonist" && player.isMarkedWithGasoline && (
        <div className="absolute bottom-5 -left-1 m-2 h-6 aspect-square flex justify-center items-center">
          <Image
            src="https://res.cloudinary.com/dnhq4fcyp/image/upload/v1706535328/spilled_tsishg.png"
            alt={"gas-marked-" + player.id}
            width={60}
            height={60}
          />
        </div>
      )}

      {/* Pure CSS flame for 3s when a player has just been burned by the Arsonist */}
      {showBurnFlame && <BurnFlameOverlay />}

      {showCardDeathFlash && (
        <div className="absolute inset-0 z-[999] pointer-events-none death-flash-card-overlay">
          <style jsx>{`
      @keyframes deathFlashCard {
        0% {
          background-color: rgba(0, 0, 0, 0.7);
        }
        50% {
          background-color: rgba(220, 38, 38, 0.9);
        }
        100% {
          background-color: rgba(0, 0, 0, 0);
        }
      }

      .death-flash-card-overlay {
        animation: deathFlashCard 700ms ease-out;
      }
    `}</style>
        </div>
      )}


      {
        player.isUnderArrest && (
          <Image
            className="h-full w-full object-contain overflow-hidden z-30"
            width={64}
            height={64}
            src={prison}
            alt="prison"
          />
        )
      }

      {
        player.id === (selectedPlayer || selectedPlayer1) && <ActionSet />
      }

      {
        (player.isRevealed ||
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
        )
      }


      <div className="absolute w-full bottom-0">
        <PlayerAvatar
          isAlive={player.isAlive}
          avatar={player.avatar}
          inGameAv={true}
          showBurnFlame={showBurnFlame}
        />
      </div>





    </div >
  );
};

export default PlayerGridCard;
