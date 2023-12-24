"use client";

const PlayerInfos = ({ playerToPlay }) => (
  <div className="bg-slate-950 rounded-xl shadow-lg p-4 mt-4 mb-2">
    <p className="text-xs text-gray-200">Your Role : {playerToPlay.role.name}</p>
  </div>
);

export default PlayerInfos;
