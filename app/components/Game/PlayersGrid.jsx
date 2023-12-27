"use client";

import { useState } from "react";
import { doubleVoteAgainst, voteAgainst, wolfDoubleVoteAgainst, wolfVoteAgainst } from "../../lib/gameActions";
import PlayerCardImage from "./PlayerCardImage";
import VoteCount from "./VoteCount";
import { becomeAccomplice } from "@/app/lib/gameActions";

const PlayersGrid = ({
  playerToPlay,
  registeredActions,
  setRegisteredActions,
  toNext,
  isSelectionMode,
  setIsSelectionMode,
  isDoubleSelection,
  setIsDoubleSelection,
  updatedPlayersList,
  setUpdatedPlayersList,
  timeOfTheDay,
  selectedActionButton,
}) => {
  const [selectedOtherPlayers, setSelectedOtherPlayers] = useState([]);

  const registerActionThatNeedSelection = (otherSelectedPlayer) => {
    setRegisteredActions([
      ...registeredActions,
      {
        type: playerToPlay.role.canPerform.type,
        player: playerToPlay.id,
        selectedPlayer: otherSelectedPlayer,
        actionTime: playerToPlay.role.canPerform.actionTime,
      },
    ]);
    setIsSelectionMode(false);
    toNext();
  };

  const registerActionThatNeedDoubleSelection = (otherSelectedPlayer, otherSelected2Player) => {
    if (playerToPlay.role.name === "Detective") {
      setRegisteredActions([
        ...registeredActions,
        {
          type: playerToPlay.role.canPerform.type,
          player: playerToPlay.id,
          selectedPlayer: otherSelectedPlayer.id,
          selectedPlayer2: otherSelected2Player.id,
          actionTime: playerToPlay.role.canPerform.actionTime,
        },
      ]);
    } else {
      setRegisteredActions([
        ...registeredActions,
        {
          type: playerToPlay.role.canPerform.type,
          player: playerToPlay.id,
          selectedPlayer: otherSelectedPlayer.id,
          actionTime: playerToPlay.role.canPerform.actionTime,
        },
        {
          type: playerToPlay.role.canPerform.type,
          player: playerToPlay.id,
          selectedPlayer: otherSelected2Player.id,
          actionTime: playerToPlay.role.canPerform.actionTime,
        },
      ]);
    }
    setIsDoubleSelection(false);
    toNext();
  };

  const voteForVotetime = (playerId, isMayor) => {
    isMayor ? doubleVoteAgainst(playerId, setUpdatedPlayersList) : voteAgainst(playerId, setUpdatedPlayersList);
    setIsSelectionMode(false);
    toNext();
  };

  const handlePlayerClick = (player) => {
    if (!player.isAlive) {
      if (playerToPlay.role.name === "Grave Robber") {
        registerActionThatNeedSelection(player);
        return;
      } else {
        console.log("This player is dead. Stop hitting its grave.");
        return;
      }
    }

    if (player.id === playerToPlay.id) {
      console.log("Don't select yourself!");
      return;
    }

    if (player.isUnderArrest) {
      console.log("this player is locked up in jail. You can't get select him.");
      return;
    }

    if (isSelectionMode) {
      if (timeOfTheDay === "votetime") {
        const isMayor = playerToPlay.role.name === "Mayor";
        voteForVotetime(player.id, isMayor);
      } else {
        if (playerToPlay.role.team.join() === "werewolves") {
          playerToPlay.role.name === "Alpha Werewolf"
            ? wolfDoubleVoteAgainst(player.id, setUpdatedPlayersList)
            : wolfVoteAgainst(player.id, setUpdatedPlayersList);
          setIsSelectionMode(false);
          toNext();
          return;
        } else if (playerToPlay.role.name === "Grave Robber") {
          console.log("this player is alive");
          return;
        } else if (
          playerToPlay.role.name === "Pyromaniac" &&
          playerToPlay.role.playersToSetOnFire.some((pouredPlayer) => player.id === pouredPlayer.id)
        ) {
          console.log("You already poured gasoline on this player.");
          return;
        } else if (playerToPlay.role.name === "Bandit") {
          if (!playerToPlay.role.partner) {
            becomeAccomplice(playerToPlay, player, setUpdatedPlayersList, toNext);
            return;
          }
        }
        registerActionThatNeedSelection(player);
      }
    } else if (isDoubleSelection) {
      if (selectedOtherPlayers.length === 0) {
        setSelectedOtherPlayers([player]);
      } else if (selectedOtherPlayers.length === 1) {
        // Two players have been selected, perform the double selection action
        registerActionThatNeedDoubleSelection(selectedOtherPlayers[0], player);
        setSelectedOtherPlayers([]); // Reset selected players
      }
    }
  };

  return (
    <div className="grid grid-cols-4 gap-2 xl:gap-6 my-2 place-items-center xl:w-[80%] xl:h-[100%]">
      {updatedPlayersList.map((player) => (
        <div
          className={`${
            player.isAlive
              ? player.id !== playerToPlay.id
                ? isSelectionMode || isDoubleSelection
                  ? "bg-slate-800 hover:bg-red-800 cursor-pointer"
                  : "bg-transparent-50 bg-cyan-900"
                : "bg-yellow-950"
              : "bg-black"
          } ${
            playerToPlay.id === player.id && "outline-1 outline outline-white"
          } w-full md:w-48 h-full md:h-full flex flex-col justify-center items-center relative rounded-xl md:rounded-3xl`}
          key={player.name}
          onClick={() => handlePlayerClick(player)}>
          <VoteCount timeOfTheDay={timeOfTheDay} player={player} />

          {/* Your player avatar displayed conditionals */}
          <div className="flex justify-center items-center py-2">
            <PlayerCardImage
              timeOfTheDay={timeOfTheDay}
              player={player}
              playerToPlay={playerToPlay}
              isDoubleSelection={isDoubleSelection}
              isSelectionMode={isSelectionMode}
              selectedActionButton={selectedActionButton}
            />
          </div>

          <div className="justify-self-end w-full overflow-hidden p-1">
            <p className="text-[10px] font-extralight	 md:text-xs text-white text-center whitespace-nowrap overflow-ellipsis">
              {player.name}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PlayersGrid;
