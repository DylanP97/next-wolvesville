"use client";

const GameHeader = ({ timeOfTheDay, dayCount, playerToPlay }) => {
  return (
    <div className="bg-slate-900 text-white rounded-xl shadow-lg p-4 my-4">
      <p className="text-xs text-white">
        {timeOfTheDay === "daytime" ? (
          <>☀️ Daytime n°{dayCount}</>
        ) : timeOfTheDay === "votetime" ? (
          <>🌅🗳️ Votetime n°{dayCount}</>
        ) : (
          <>🌙 Nighttime n°{dayCount}</>
        )}
        <>
         {" "} - {playerToPlay.name} {" "} : It&apos;s your time to play
        </>
      </p>
    </div>
  );
};

export default GameHeader;
