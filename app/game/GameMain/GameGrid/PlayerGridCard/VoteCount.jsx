"use client"

const VoteCount = ({
    voteNbr
}) => {

    return (
        <div className="bg-gray-950 absolute top-0 right-0 p-1 h-6 flex justify-center items-center">
            <p className="text-white text-xs">{voteNbr || 0}</p>
        </div>
    )
}

export default VoteCount;