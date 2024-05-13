"use client"

import Image from "next/image"
import AvatarUI from "../../../profile/components/AvatarUI"
import tombstone from "../../../../public/game/tombstone.png"
import prison from "../../../../public/game/prison.png"

const PlayerAvatar = ({
    isAlive,
    isUnderArrest,
    avatar
}) => {

    return (
        <>
            {!isAlive ? (
                <Image width={60} height={60} src={tombstone} alt="tombstone" />
            ) : isUnderArrest ? (
                <Image className="max-h-[60px] " width={60} height={60} src={prison} alt="prison" />
            ) : (
                <AvatarUI heightAndWidth={60} avatar={avatar} />
            )}
        </>
    )
}

export default PlayerAvatar