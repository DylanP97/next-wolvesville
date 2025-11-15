"use client"

const VoteCount = ({
    voteNbr
}) => {

    return (
        <div className="bg-red-600 absolute top-0 left-0 px-2 py-1 h-8 w-8 flex justify-center items-center rounded-full border-2 border-red-400 shadow-md font-bold">
            <p className="text-white text-sm">{voteNbr || 0}</p>
        </div>
    )
}

export default VoteCount;