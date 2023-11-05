"use client";

const PlayerBoard = ({
  timeOfTheDay,
  playerToPlay,
  registeredNightActions,
  setRegisteredNightActions,
  toNext,
  isSelectionMode,
  setIsSelectionMode,
}) => {

  const someOtherAction = () => {
    setRegisteredNightActions([
      ...registeredNightActions,
      {
        type: playerToPlay.role.canPerformAtNighttime.type,
        player: playerToPlay.id,
      },
    ]);
    console.log("some other action");
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-900 rounded-xl shadow-lg p-4 my-4">
          <p className="text-xs text-gray-200">
            {playerToPlay.role.name} it&apos;s your time to play{" "}
            {playerToPlay.role.canPerformAtNighttime === null && (
              <>but you have no actions to do</>
            )}
          </p>
        </div>
        <div className="flex flex-row gap-2">
          {timeOfTheDay === "nighttime" &&
            playerToPlay.role.canPerformAtNighttime !== null && (
              <div
                onClick={() => {
                  playerToPlay.role.canPerformAtNighttime.needSelection
                    ? setIsSelectionMode(!isSelectionMode)
                    : someOtherAction();
                }}
                className="border border-red bg-red-900 hover:bg-red-800 rounded-xl shadow-lg p-4 my-4 cursor-pointer">
                <p className="text-xs text-gray-200">
                  {!isSelectionMode ? (
                    playerToPlay.role.canPerformAtNighttime.label
                  ) : (
                    <>Cancel selection</>
                  )}
                </p>
              </div>
            )}
            {timeOfTheDay === "votetime" && playerToPlay.role.canVote && (
              <div
                onClick={() => {setIsSelectionMode(!isSelectionMode)}}
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
          <div
            onClick={() => toNext()}
            className="border border-red bg-slate-600 hover:bg-slate-700 rounded-xl shadow-lg p-4 my-4 cursor-pointer">
            <p className="text-xs text-gray-200">To next player</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerBoard;
