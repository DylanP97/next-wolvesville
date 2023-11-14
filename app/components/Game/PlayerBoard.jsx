"use client";

import { burnPlayers, explodeBomb } from "@/app/lib/gameActions";
import PlayerInfos from "./PlayerInfos";
import { Kbd } from "@nextui-org/react";

// Extracted Action Component
const Action = ({ onClick, label, kbdComponent, bgColor }) => (
  <div
    onClick={onClick}
    className={`z-20 rounded-xl shadow-lg p-4 my-4 cursor-pointer bg-${bgColor} hover:bg-${bgColor}-400`}>
    <p className="text-xs text-gray-200">{label}</p>
    {kbdComponent}
  </div>
);

// Extracted DoubleSelectionAction Component
const DoubleSelectionAction = ({ isDoubleSelection, onClick, label }) => (
  <Action
    onClick={onClick}
    label={!isDoubleSelection ? label : "Cancel selection"}
    kbdComponent={<Kbd className="m-2">1</Kbd>}
    bgColor="cyan-600"
  />
);

// Extracted NightAction Component
const NightAction = ({ canPerform, setIsSelectionMode, isSelectionMode }) => (
  <Action
    onClick={() => {
      canPerform.needSelection
        ? setIsSelectionMode(!isSelectionMode)
        : registerSimpleAction(registeredActions, setRegisteredActions, playerToPlay, toNext);
    }}
    label={!isSelectionMode ? canPerform.label : "Cancel selection"}
    kbdComponent={<Kbd className="m-2">1</Kbd>}
    bgColor="cyan-600"
  />
);

const BanditAction = ({ isSelectionMode, setIsSelectionMode, registerSimpleAction, playerToPlay }) => (
  <Action
    onClick={() => {
      playerToPlay.role.name === "Bandit" && !playerToPlay.partner
        ? setIsSelectionMode(!isSelectionMode)
        : registerSimpleAction();
    }}
    label={
      !isSelectionMode ? (
        playerToPlay.role.name === "Bandit" && !playerToPlay.partner ? (
          <>Select an accomplice</>
        ) : (
          playerToPlay.role.canPerform.label
        )
      ) : (
        <>Cancel selection</>
      )
    }
    kbdComponent={<Kbd className="m-2">1</Kbd>}
    bgColor="cyan-600"
  />
);

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
  // Destructure props
  const {
    role: { canPerform, name, bombPower, playersToSetOnFire },
    isUnderArrest,
    partner,
    canVote,
  } = playerToPlay;

  const registerSimpleAction = () => {
    setRegisteredActions([
      ...registeredActions,
      {
        type: playerToPlay.role.canPerform.type,
        player: playerToPlay.id,
      },
    ]);
    toNext();
  };

  const twClassesDiv = "z-20 rounded-xl shadow-lg p-4 my-4 cursor-pointer";
  const deadPlayers = updatedPlayersList.filter((player) => !player.isAlive);

  return (
    <div className={twClassesDiv}>
      <div className="gap-4">
        {/* PlayerInfos component */}
        <PlayerInfos playerToPlay={playerToPlay} />

        <div className="z-20 actions-board flex flex-row gap-4">
          {/* Extracted Action Components */}
          {canPerform !== null && (
            <>
              {/* Double Selection */}
              {!isUnderArrest &&
                canPerform.nbrLeftToPerform !== 0 &&
                canPerform.needDoubleSelection &&
                ((timeOfTheDay === "daytime" && canPerform.actionTime === "day") ||
                  (timeOfTheDay === "nighttime" && canPerform.actionTime === "night")) && (
                  <DoubleSelectionAction
                    isDoubleSelection={isDoubleSelection}
                    onClick={() => setIsDoubleSelection(!isDoubleSelection)}
                    label={canPerform.label}
                  />
                )}

              {/* Grave Robber Action */}
              {!isUnderArrest &&
                canPerform.nbrLeftToPerform !== 0 &&
                timeOfTheDay === "nighttime" &&
                !canPerform.needDoubleSelection &&
                canPerform.actionTime === "night" &&
                name === "Grave Robber" &&
                deadPlayers.length > 0 && (
                  <NightAction
                    canPerform={canPerform}
                    setIsSelectionMode={setIsSelectionMode}
                    isSelectionMode={isSelectionMode}
                    registerSimpleAction={registerSimpleAction}
                  />
                )}

              {/* Other Night Actions */}
              {!isUnderArrest &&
                canPerform.nbrLeftToPerform !== 0 &&
                timeOfTheDay === "nighttime" &&
                !canPerform.needDoubleSelection &&
                canPerform.actionTime === "night" &&
                name !== "Grave Robber" && (
                  <NightAction
                    canPerform={canPerform}
                    setIsSelectionMode={setIsSelectionMode}
                    isSelectionMode={isSelectionMode}
                  />
                )}

              {/* Day Actions */}
              {canPerform.nbrLeftToPerform !== 0 && timeOfTheDay === "daytime" && canPerform.actionTime === "day" && (
                <NightAction
                  canPerform={canPerform}
                  setIsSelectionMode={setIsSelectionMode}
                  isSelectionMode={isSelectionMode}
                />
              )}

              {/* Bandit Action */}
              {!isUnderArrest &&
                canPerform.nbrLeftToPerform !== 0 &&
                timeOfTheDay === "nighttime" &&
                !canPerform.needDoubleSelection &&
                canPerform.actionTime === "night" &&
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

          {/* Explode Bomb Action */}
          {timeOfTheDay === "nighttime" && name === "Terrorist" && bombPower > 0 && (
            <Action
              onClick={() => explodeBomb(bombPower, setUpdatedPlayersList, displayAction, toNext)}
              label={`Explode Bomb, current power: can kill up to ${bombPower} person`}
              kbdComponent={<Kbd className="m-2">2</Kbd>}
              bgColor="teal-600"
            />
          )}

          {/* Burn Players Action */}
          {timeOfTheDay === "nighttime" && name === "Pyromaniac" && playersToSetOnFire.length > 0 && (
            <Action
              onClick={() => burnPlayers(playersToSetOnFire, setUpdatedPlayersList, displayAction, toNext)}
              label={`Burn ${playersToSetOnFire.length} players`}
              kbdComponent={<Kbd className="m-2">2</Kbd>}
              bgColor="teal-600"
            />
          )}

          {/* Vote Action */}
          {timeOfTheDay === "votetime" && name !== "Mayor" && canVote && (
            <Action
              onClick={() => setIsSelectionMode(!isSelectionMode)}
              label={!isSelectionMode ? "Select a player to vote against!" : "Cancel selection"}
              kbdComponent={<Kbd className="m-2">1</Kbd>}
              bgColor="cyan-600"
            />
          )}

          {/* DoubleVote Action for Mayor */}
          {timeOfTheDay === "votetime" && name === "Mayor" && canVote && (
            <Action
              onClick={() => setIsSelectionMode(!isSelectionMode)}
              label={!isSelectionMode ? canPerform.label : "Cancel selection"}
              kbdComponent={<Kbd className="m-2">1</Kbd>}
              bgColor="cyan-600"
            />
          )}
        </div>

        {/* To next player action */}
        <Action
          onClick={() => toNext()}
          label="To next player"
          kbdComponent={
            <Kbd className="m-2" keys={["enter"]}>
              Enter
            </Kbd>
          }
          bgColor="slate-600"
        />
      </div>
    </div>
  );
};

export default PlayerBoard;
