"use client";

import { burnPlayers } from "@/app/lib/charactersActions";

const PlayerInfo = ({ playerToPlay }) => (
  <div className="bg-slate-950 rounded-xl shadow-lg p-4 my-4">
    <p className="text-xs text-gray-200">
      {playerToPlay.role.name} it&apos;s your time to play{" "}
      {playerToPlay.isUnderArrest && <>you can do nothing while in jail</>}
      {playerToPlay.role.canPerform === null && (
        <>but you have no actions to do</>
      )}
    </p>
  </div>
);

const PlayerBoard = ({
  timeOfTheDay,
  playerToPlay,
  registeredActions,
  setRegisteredActions,
  toNext,
  isSelectionMode,
  setIsSelectionMode,
  isDoubleSelection,
  setIsDoubleSelection,
  setUpdatedPlayersList,
  displayAction
}) => {
  const registerSimpleAction = () => {
    setRegisteredActions([
      ...registeredActions,
      {
        type: playerToPlay.role.canPerform.type,
        player: playerToPlay.id,
      },
    ]);
    console.log("some other action");
  };

  const twClassesDiv =
    "z-20 border border-red bg-slate-600 hover:bg-slate-700 rounded-xl shadow-lg p-4 my-4 cursor-pointer";

  return (
    <div className="z-20">
      <div className="gap-4">
        <PlayerInfo playerToPlay={playerToPlay} />
        <div className="z-20 actions-board flex flex-row gap-4">
          <div onClick={() => toNext()} className={twClassesDiv}>
            <p className="text-xs text-gray-200">To next player</p>
          </div>
          {playerToPlay.role.canPerform !== null && (
            <>
              {/* If it's night or day, check for actions that need double selection */}
              {!playerToPlay.isUnderArrest &&
                playerToPlay.role.canPerform.nbrLeftToPerform !== 0 &&
                playerToPlay.role.canPerform.needDoubleSelection &&
                ((timeOfTheDay === "daytime" &&
                  playerToPlay.role.canPerform.actionTime === "day") ||
                  (timeOfTheDay === "nighttime" &&
                    playerToPlay.role.canPerform.actionTime === "night")) && (
                  <div
                    onClick={() => {
                      setIsDoubleSelection(!isDoubleSelection);
                    }}
                    className={twClassesDiv}>
                    <p className="text-xs text-gray-200">
                      {!isDoubleSelection ? (
                        playerToPlay.role.canPerform.label
                      ) : (
                        <>Cancel selection</>
                      )}
                    </p>
                  </div>
                )}

              {/* If it's night, check for night actions and that need selection */}
              {!playerToPlay.isUnderArrest &&
                playerToPlay.role.canPerform.nbrLeftToPerform !== 0 &&
                playerToPlay.role.canPerform.needSelection &&
                timeOfTheDay === "nighttime" &&
                playerToPlay.role.canPerform.actionTime === "night" && (
                  <div
                    onClick={() => {
                      playerToPlay.role.canPerform.needSelection
                        ? setIsSelectionMode(!isSelectionMode)
                        : registerSimpleAction();
                    }}
                    className={twClassesDiv}>
                    <p className="text-xs text-gray-200">
                      {!isSelectionMode ? (
                        playerToPlay.role.canPerform.label
                      ) : (
                        <>Cancel selection</>
                      )}
                    </p>
                  </div>
                )}

              {/* If it's day, check for day actions and that need selection */}
              {playerToPlay.role.canPerform.nbrLeftToPerform !== 0 &&
                playerToPlay.role.canPerform.needSelection &&
                timeOfTheDay === "daytime" &&
                playerToPlay.role.canPerform.actionTime === "day" && (
                  <div
                    onClick={() => {
                      playerToPlay.role.canPerform.needSelection
                        ? setIsSelectionMode(!isSelectionMode)
                        : registerSimpleAction();
                    }}
                    className={twClassesDiv}>
                    <p className="text-xs text-gray-200">
                      {!isSelectionMode ? (
                        playerToPlay.role.canPerform.label
                      ) : (
                        <>Cancel selection</>
                      )}
                    </p>
                  </div>
                )}
            </>
          )}

          {timeOfTheDay === "nighttime" &&
            playerToPlay.role.name === "Pyromaniac" &&
            playerToPlay.role.playersToSetOnFire.length > 0 && (
              <div
                onClick={() => {
                  burnPlayers(
                    playerToPlay.role.playersToSetOnFire,
                    setUpdatedPlayersList,
                    displayAction,
                    toNext
                  );
                }}
                className={twClassesDiv}>
                <p className="text-xs text-gray-200">
                  Burn {playerToPlay.role.playersToSetOnFire.length} players
                </p>
              </div>
            )}

          {/* If it's votetime, action to vote */}
          <div className="flex flex-row gap-2">
            {timeOfTheDay === "votetime" && playerToPlay.role.canVote && (
              <div
                onClick={() => {
                  setIsSelectionMode(!isSelectionMode);
                }}
                className={twClassesDiv}>
                <p className="text-xs text-gray-200">
                  {!isSelectionMode ? (
                    <>Select a player to vote against!</>
                  ) : (
                    <>Cancel selection</>
                  )}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerBoard;
