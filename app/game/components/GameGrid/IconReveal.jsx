"use client"

import Image from "next/image";

const IconReveal = ({
    roleIcon,
}) => {

    return (
        <div className="absolute bottom-0 right-0 m-2 h-8 aspect-square flex justify-center items-center">
            <Image
                src={roleIcon}
                width={60}
                height={60}
                alt="role"
            />
        </div>
    )
}

export default IconReveal;