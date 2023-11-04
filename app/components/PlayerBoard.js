"use client";

import React, { useEffect, useState, useRef } from "react";

const PlayerBoard = ({
  playerToPlay,
  setPlayerToPlay,
  registeredNightActions,
  setRegisteredNightActions,
  nextAction,
}) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="w-full">
      <div>
        {isClient && (
          <>
            <div className="bg-slate-900 rounded-xl shadow-lg p-4 my-4">
              <p className="text-xs text-gray-200">
                {playerToPlay.role.name} it&apos;s your time to play
              </p>
            </div>
            {playerToPlay.role.canPerformAtNighttime !== null && (
              <div
                onClick={() =>
                  setRegisteredNightActions([
                    ...registeredNightActions,
                    {
                      action: playerToPlay.role.canPerformAtNighttime,
                      player: playerToPlay.id,
                    },
                  ])
                }
                className="bg-blue-900 rounded-xl shadow-lg p-4 my-4 cursor-pointer">
                <p className="text-xs text-gray-200">
                  you can {playerToPlay.role.canPerformAtNighttime}
                </p>
              </div>
            )}
          </>
        )}
        <div
          onClick={() => nextAction()}
          className="bg-slate-800 rounded-xl shadow-lg p-4 my-4 cursor-pointer">
          <p className="text-xs text-gray-200">Next Action</p>
        </div>
      </div>
    </div>
  );
};

export default PlayerBoard;
