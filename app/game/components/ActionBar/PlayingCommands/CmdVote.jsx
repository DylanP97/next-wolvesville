"use client";

import Image from "next/image";
import { Tooltip } from "@nextui-org/react";
import voteAgainstIcon from "../../../../../public/game/vote-time.png";

const CmdVote = ({ activateSelection, isSelection, wolfVote }) => {
  return (
    <Tooltip content={"Vote against a player"} color="secondary" variant="flat">
      <div
        onClick={() => activateSelection(wolfVote ? "wolfVote" : "vote")}
        className={`${
          isSelection ? "bg-slate-900" : "bg-red-800 hover:bg-red-600"
        } h-[80px] aspect-square p-2 cursor-pointer flex justify-center items-center z-20`}
      >
        <Image
          src={
            wolfVote
              ? "https://res.cloudinary.com/dnhq4fcyp/image/upload/v1717423963/wolfvote2_ba9iir.webp"
              : voteAgainstIcon.src
          }
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
