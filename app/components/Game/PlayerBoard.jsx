"use client";

import { burnPlayers, explodeBomb, registerSimpleAction } from "@/app/lib/gameActions";
import { Kbd } from "@nextui-org/react";
import Action from "./Action";
import ActionSetter from "./action-types/ActionSetter";
import DoubleSelectionAction from "./action-types/DoubleSelectionAction";
import BanditSelectAccompliceAction from "./action-types/BanditSelectAccompliceAction";

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

            {!isUnderArrest &&
              !needDoubleSelection &&
              (nbrLeftToPerform === undefined || nbrLeftToPerform > 0) &&
              ((timeOfTheDay === "daytime" && actionTime === "day") ||
                (timeOfTheDay === "nighttime" && actionTime === "night")) &&
              (name !== "Grave Robber" || (name === "Grave Robber" && deadPlayers.length > 0)) && (
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
              (nbrLeftToPerform === undefined || nbrLeftToPerform > 0) &&
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

            {!isUnderArrest &&
              (nbrLeftToPerform === undefined || nbrLeftToPerform > 0) &&
              timeOfTheDay === "nighttime" &&
              !needDoubleSelection &&
              actionTime === "night" &&
              name === "Bandit" && (
                <BanditSelectAccompliceAction
                  isSelectionMode={isSelectionMode}
                  setIsSelectionMode={setIsSelectionMode}
                  registerSimpleAction={registerSimpleAction}
                  playerToPlay={playerToPlay}
                />
              )}
          </>
        )}

        {/* ************************************************************************************* */}

        {timeOfTheDay === "nighttime" && name === "Terrorist" && bombPower > 0 && (
          <Action
            onClick={() => explodeBomb(bombPower, setUpdatedPlayersList, displayAction, toNext)}
            label={`Explode Bomb, current power: can kill up to ${bombPower} person`}
            kbdComponent={<Kbd className="m-2">2</Kbd>}
            bgColor="bg-black-950"
            dataname="explode"
          />
        )}

        {timeOfTheDay === "nighttime" && name === "Pyromaniac" && playersToSetOnFire.length > 0 && (
          <Action
            onClick={() => burnPlayers(playersToSetOnFire, setUpdatedPlayersList, displayAction, toNext)}
            label={`Burn ${playersToSetOnFire.length} players`}
            kbdComponent={<Kbd className="m-2">2</Kbd>}
            bgColor="bg-orange-900"
            dataname="burn"
          />
        )}

        {timeOfTheDay === "votetime" && name !== "Mayor" && canVote && (
          <Action
            onClick={() => setIsSelectionMode(!isSelectionMode)}
            label={!isSelectionMode ? "Select a player to vote against!" : "Cancel selection"}
            kbdComponent={<Kbd className="m-2">1</Kbd>}
            bgColor="bg-cyan-900"
            dataname="vote"
          />
        )}

        {timeOfTheDay === "votetime" && name === "Mayor" && canVote && (
          <Action
            onClick={() => setIsSelectionMode(!isSelectionMode)}
            label={!isSelectionMode ? label : "Cancel selection"}
            kbdComponent={<Kbd className="m-2">1</Kbd>}
            bgColor="bg-cyan-700"
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
        bgColor="bg-slate-950"
        dataname="next"
      />
    </div>
  );
};

export default PlayerBoard;
