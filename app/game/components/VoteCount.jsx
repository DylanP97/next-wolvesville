"use client";

const VoteCount = ({ timeOfTheDay, player }) => {
  return (
    timeOfTheDay === "votetime" &&
    player.voteAgainst > 0 && (
      <div className="absolute top-[-10px] right-[-10px] h-8 w-8 p-2 flex justify-center items-center rounded-full bg-red-400">
        <p>{player.voteAgainst}</p>
      </div>
    )
  );
};

export default VoteCount;
