"use client";

const PlayerInfos = ({ playerToPlay }) => (
  <div className="bg-slate-950 rounded-xl shadow-lg p-4 my-4">
    <p className="text-xs text-gray-200">
      {playerToPlay.role.name} it&apos;s your time to play{" "}
      {playerToPlay.isUnderArrest && <>you can do nothing while in jail</>}
      {playerToPlay.role.canPerform === null && <>but you have no actions to do</>}
    </p>
  </div>
);

export default PlayerInfos;
