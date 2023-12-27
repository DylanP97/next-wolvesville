"use client";

const PlayerInfos = ({ playerToPlay }) => (
  <div className="bg-slate-950 rounded-xl shadow-lg p-4 mt-4 mb-2">
    <p className="text-xs text-gray-200">{playerToPlay.name} It&apos;s your time to play</p>
    <p className="text-xs text-gray-200">Your role is {playerToPlay.role.name}</p>
    <p className="text-xs text-gray-200">{playerToPlay.role.description}</p>
  </div>
);

export default PlayerInfos;
