"use client";

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



  return (
    <div className="w-full">
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-950 rounded-xl shadow-lg p-4 my-4">
          <p className="text-xs text-gray-200">
            {playerToPlay.role.name} it&apos;s your time to play{" "}
            {playerToPlay.isUnderArrest && (
              <>you can do nothing while in jail</>
            )}
            {playerToPlay.role.canPerform === null && (
              <>but you have no actions to do</>
            )}
          </p>
        </div>
        <div className="actions-board flex flex-row gap-4">
          <div
            onClick={() => toNext()}
            className="border border-red bg-slate-600 hover:bg-slate-700 rounded-xl shadow-lg p-4 my-4 cursor-pointer">
            <p className="text-xs text-gray-200">To next player</p>
          </div>
          {playerToPlay.role.canPerform !== null && (
            <>
              {playerToPlay.isAlive &&
                !playerToPlay.isUnderArrest &&
                playerToPlay.role.canPerform.needDoubleSelection && (
                  <div
                    onClick={() => {
                      setIsDoubleSelection(!isDoubleSelection);
                    }}
                    className="border border-red bg-red-900 hover:bg-red-800 rounded-xl shadow-lg p-4 my-4 cursor-pointer">
                    <p className="text-xs text-gray-200">
                      {!isDoubleSelection ? (
                        playerToPlay.role.canPerform.label
                      ) : (
                        <>Cancel selection</>
                      )}
                    </p>
                  </div>
                )}
              {timeOfTheDay === "nighttime" &&
                !playerToPlay.isUnderArrest &&
                playerToPlay.role.canPerform.actionTime === "night" && (
                  <div
                    onClick={() => {
                      playerToPlay.role.canPerform.needSelection
                        ? setIsSelectionMode(!isSelectionMode)
                        : registerSimpleAction();
                    }}
                    className="border border-red bg-red-900 hover:bg-red-800 rounded-xl shadow-lg p-4 my-4 cursor-pointer">
                    <p className="text-xs text-gray-200">
                      {!isSelectionMode ? (
                        playerToPlay.role.canPerform.label
                      ) : (
                        <>Cancel selection</>
                      )}
                    </p>
                  </div>
                )}
              {timeOfTheDay === "daytime" &&
                playerToPlay.role.canPerform.actionTime === "day" && (
                  <div
                    onClick={() => {
                      playerToPlay.role.canPerform.needSelection
                        ? setIsSelectionMode(!isSelectionMode)
                        : registerSimpleAction();
                    }}
                    className="border border-red bg-red-900 hover:bg-red-800 rounded-xl shadow-lg p-4 my-4 cursor-pointer">
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
          <div className="flex flex-row gap-2">
            {timeOfTheDay === "votetime" && playerToPlay.role.canVote && (
              <div
                onClick={() => {
                  setIsSelectionMode(!isSelectionMode);
                }}
                className="border border-red bg-red-900 hover:bg-red-800 rounded-xl shadow-lg p-4 my-4 cursor-pointer">
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
