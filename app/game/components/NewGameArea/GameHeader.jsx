"use client";

const GameHeader = ({ timeOfTheDay, dayCount, timeCounter }) => {
  return (
    <div className="bg-slate-900 text-white shadow-lg p-2">
      <p className="text-xs text-white">
        {timeOfTheDay === "daytime" ? (
          <>☀️ Daytime n°{dayCount} - {timeCounter / 1000}s left</>
        ) : timeOfTheDay === "votetime" ? (
          <>🌅🗳️ Votetime n°{dayCount} - {timeCounter / 1000}s left</>
        ) : (
          <>🌙 Nighttime n°{dayCount} - {timeCounter / 1000}s left</>
        )}
      </p>
    </div>
  );
};

export default GameHeader;
