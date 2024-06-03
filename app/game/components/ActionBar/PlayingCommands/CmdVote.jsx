"use client";

import Image from "next/image";
import { Tooltip } from "@nextui-org/react";
import voteAgainstIcon from "../../../../../public/game/vote-time.png";

const CmdVote = ({ activateSelection, isSelection }) => {
  return (
    <Tooltip content={"Vote against a player"} color="secondary" variant="flat">
      <div
        onClick={() => activateSelection("vote")}
        className={`${
          isSelection ? "bg-slate-900" : "bg-red-800 hover:bg-red-600"
        } h-[80px] aspect-square p-2 cursor-pointer flex justify-center items-center z-20`}
      >
        <Image
          src={voteAgainstIcon.src}
          alt="voteAgainst"
          width={50}
          height={50}
          style={{ height: "auto", width: "auto" }}
          className="max-h-[50px] max-w-[50px] object-contain	"
        />
      </div>
    </Tooltip>
  );
};

export default CmdVote;
