"use client";

const GameHeader = ({ timeOfTheDay, dayCount, playerToPlay }) => {
  return (
    <div className="bg-slate-900 rounded-xl shadow-lg p-4 my-4">
      <p className="text-xs">
        {timeOfTheDay === "daytime" ? (
          <>☀️ Daytime n°{dayCount}</>
        ) : timeOfTheDay === "votetime" ? (
          <>🌅🗳️ Votetime n°{dayCount}</>
        ) : (
          <>🌙 Nighttime n°{dayCount}</>
        )}
        <>
         {" "} - {playerToPlay.name} it&apos;s your time to play
        </>
      </p>
    </div>
  );
};

export default GameHeader;
