"use client"

const VotingAgainst = ({ hasVotedFor }) => {


    return (
        <div className="bg-yellow-900 h-[16px] w-[60px] m-auto absolute bottom-0 z-20 flex flex-row justify-center items-center">
            <p className="text-white text-[10px] text-center">{hasVotedFor || "..."}</p>
        </div>
    );
};

export default VotingAgainst;