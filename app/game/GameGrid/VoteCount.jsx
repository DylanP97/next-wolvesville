"use client"

const VoteCount = ({ voteNbr, isWolfVote }) => {
  const getBgColor = () => {
    if (isWolfVote) return "bg-blue-600 border-blue-400";
    return "bg-red-600 border-red-400";
  };

  if (!voteNbr) return null;

  return (
    <div className={`${getBgColor()} absolute -top-0 -left-0 px-2 py-1 h-6 w-6 md:h-8 md:w-8 flex justify-center items-center rounded-full border-2 shadow-md font-bold`}>
      <p className="text-white text-xs md:text-sm">{voteNbr || 0}</p>
    </div>
  );
};

export default VoteCount;