"use client";

import { Image } from "@nextui-org/react";

const handleClick = (action) => {
    setIsSelection(!isSelection);
}

export const Command1 = (action, image) => {
    return (
        <div onClick={() => handleClick(action)} className="w-[50px] p-[5px] cursor-pointer hover:bg-slate-500 rounded-xl flex justify-center items-center">
            <Image
                src={image}
                alt={action}
                width={50}
                height={50}
                style={{ width: "auto", height: "auto" }}
            />
        </div>
    )
}

export const Command2 = (action, image) => {
    return (
        <div onClick={() => handleClick(action)} className="w-[50px] p-[5px] cursor-pointer hover:bg-slate-500 rounded-xl flex justify-center items-center">
            <Image
                src={image}
                alt={action}
                width={50}
                height={50}
                style={{ width: "auto", height: "auto" }}
            />
        </div>
    )
}