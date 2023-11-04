"use client";

import React, { useEffect, useState, useRef } from "react";

const PlayerBoard = ({
  playerToPlay,
  setPlayerToPlay,
  registeredNightActions,
  setRegisteredNightActions,
  nextAction,
}) => {

  return (
    <div className="w-full">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-zinc-900 rounded-xl shadow-lg p-4 my-4">
            <p className="text-xs text-gray-200">
              {playerToPlay.role.name} it&apos;s your time to play
            </p>
          </div>
          <div className="flex flex-row gap-2">
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
                className="border border-blue bg-blue-900 hover:bg-blue-800 rounded-xl shadow-lg p-4 my-4 cursor-pointer">
                <p className="text-xs text-gray-200">
                  you can {playerToPlay.role.canPerformAtNighttime}
                </p>
              </div>
            )}
            <div
              onClick={() => nextAction()}
              className="border border-blue bg-blue-800 hover:bg-blue-700 rounded-xl shadow-lg p-4 my-4 cursor-pointer">
              <p className="text-xs text-gray-200">Next Action</p>
            </div>
          </div>
        </div>
    </div>
  );
};

export default PlayerBoard;
