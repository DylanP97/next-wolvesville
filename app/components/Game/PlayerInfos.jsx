"use client";

const PlayerInfos = ({ playerToPlay }) => (
  <div className="bg-slate-950 rounded-xl shadow-lg p-4 my-4">
    <p className="text-xs text-gray-200">Role: {playerToPlay.role.name}</p>
  </div>
);

export default PlayerInfos;
