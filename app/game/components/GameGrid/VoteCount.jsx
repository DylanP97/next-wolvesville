"use client"

const VoteCount = ({
    voteNbr
}) => {

    return (
        <div className="bg-gray-950 absolute top-0 right-0 p-2 h-8 aspect-square flex justify-center items-center">
            <p className="text-white">{voteNbr || 0}</p>
        </div>
    )
}

export default VoteCount;