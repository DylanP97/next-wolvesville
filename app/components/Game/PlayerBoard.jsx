"use client";

import { burnPlayers, explodeBomb, registerSimpleAction } from "@/app/lib/gameActions";
import { Kbd } from "@nextui-org/react";
import Action from "./Action";
import ActionSetter from "./action-types/ActionSetter";
import DoubleSelectionAction from "./action-types/DoubleSelectionAction";
import BanditAction from "./action-types/BanditAction";

const PlayerBoard = ({
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
  displayAction,
}) => {
  const deadPlayers = updatedPlayersList.filter((player) => !player.isAlive);

  const {
    role: { canVote, canPerform, name, bombPower, playersToSetOnFire, partner } = {}, // Default to an empty object if role is not defined
    isUnderArrest,
  } = playerToPlay;

  // Check if canPerform is defined before further destructuring
  const {
    label = undefined,
    needSelection = undefined,
    needDoubleSelection = undefined,
    actionTime = undefined,
    nbrLeftToPerform = undefined,
  } = canPerform || {};

  return (
    <div className="gap-4">
      <div className="z-20 actions-board flex flex-row gap-4">
        {playerToPlay.role.canPerform && (
          <>
            {/* ************************************************************************************* */}

            {/* For Action Setter */}
            {!isUnderArrest &&
              (!nbrLeftToPerform || nbrLeftToPerform > 0) &&
              !needDoubleSelection &&
              ((timeOfTheDay === "daytime" && actionTime === "day") ||
                (timeOfTheDay === "nighttime" && actionTime === "night")) &&
              name !== "Grave Robber" && (
                <ActionSetter
                  label={label}
                  needSelection={needSelection}
                  setIsSelectionMode={setIsSelectionMode}
                  isSelectionMode={isSelectionMode}
                  registerSimpleAction={registerSimpleAction}
                  registeredActions={registeredActions}
                  setRegisteredActions={setRegisteredActions}
                  dataname="night"
                  playerToPlay={playerToPlay}
                  toNext={toNext}
                />
              )}

            {/* ************************************************************************************* */}

            {!isUnderArrest &&
              (!nbrLeftToPerform || nbrLeftToPerform > 0) &&
              needDoubleSelection &&
              ((timeOfTheDay === "daytime" && actionTime === "day") ||
                (timeOfTheDay === "nighttime" && actionTime === "night")) && (
                <DoubleSelectionAction
                  isDoubleSelection={isDoubleSelection}
                  onClick={() => setIsDoubleSelection(!isDoubleSelection)}
                  label={label}
                />
              )}

            {/* ************************************************************************************* */}

            {/* Grave Robber Action */}
            {!isUnderArrest &&
              (!nbrLeftToPerform || nbrLeftToPerform > 0) &&
              timeOfTheDay === "nighttime" &&
              !needDoubleSelection &&
              actionTime === "night" &&
              name === "Grave Robber" &&
              deadPlayers.length > 0 && (
                <ActionSetter
                  label={label}
                  needSelection={needSelection}
                  setIsSelectionMode={setIsSelectionMode}
                  isSelectionMode={isSelectionMode}
                  registerSimpleAction={registerSimpleAction}
                  registeredActions={registeredActions}
                  setRegisteredActions={setRegisteredActions}
                  dataname="graverobber"
                />
              )}

            {!isUnderArrest &&
              (!nbrLeftToPerform || nbrLeftToPerform > 0) &&
              timeOfTheDay === "nighttime" &&
              !needDoubleSelection &&
              actionTime === "night" &&
              name === "Bandit" && (
                <BanditAction
                  isSelectionMode={isSelectionMode}
                  setIsSelectionMode={setIsSelectionMode}
                  registerSimpleAction={registerSimpleAction}
                  playerToPlay={playerToPlay}
                />
              )}
          </>
        )}

        {/* ************************************************************************************* */}

        {/* Explode Bomb Action */}
        {timeOfTheDay === "nighttime" && name === "Terrorist" && bombPower > 0 && (
          <Action
            onClick={() => explodeBomb(bombPower, setUpdatedPlayersList, displayAction, toNext)}
            label={`Explode Bomb, current power: can kill up to ${bombPower} person`}
            kbdComponent={<Kbd className="m-2">2</Kbd>}
            bgColor="teal-600"
            dataname="explode"
          />
        )}

        {/* Burn Players Action */}
        {timeOfTheDay === "nighttime" && name === "Pyromaniac" && playersToSetOnFire.length > 0 && (
          <Action
            onClick={() => burnPlayers(playersToSetOnFire, setUpdatedPlayersList, displayAction, toNext)}
            label={`Burn ${playersToSetOnFire.length} players`}
            kbdComponent={<Kbd className="m-2">2</Kbd>}
            bgColor="teal-600"
            dataname="burn"
          />
        )}

        {/* Vote Action */}
        {timeOfTheDay === "votetime" && name !== "Mayor" && canVote && (
          <Action
            onClick={() => setIsSelectionMode(!isSelectionMode)}
            label={!isSelectionMode ? "Select a player to vote against!" : "Cancel selection"}
            kbdComponent={<Kbd className="m-2">1</Kbd>}
            bgColor="cyan-600"
            dataname="vote"
          />
        )}

        {/* DoubleVote Action for Mayor */}
        {timeOfTheDay === "votetime" && name === "Mayor" && canVote && (
          <Action
            onClick={() => setIsSelectionMode(!isSelectionMode)}
            label={!isSelectionMode ? label : "Cancel selection"}
            kbdComponent={<Kbd className="m-2">1</Kbd>}
            bgColor="cyan-600"
            dataname="doublevotemayor"
          />
        )}
      </div>

      <Action
        onClick={() => toNext()}
        label="To next player"
        kbdComponent={
          <Kbd className="m-2" keys={["enter"]}>
            Enter
          </Kbd>
        }
        bgColor="slate-600"
        dataname="next"
      />
    </div>
  );
};

export default PlayerBoard;
