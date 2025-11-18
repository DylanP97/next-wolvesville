"use client";

import Image from "next/image";
import { Tooltip } from "@nextui-org/react";
import voteAgainstIcon from "../../public/game/vote-time.png";
import { useTranslation } from "react-i18next";
import { divActionIcon, imgActionIcon } from "../lib/styles";
import { useGame } from "./GameProvider";

const CmdVote = ({ activateSelection, wolfVote }) => {
  const { t } = useTranslation();
  const { selectionState } = useGame(); // <-- ADD THIS
  const actionType = selectionState.actionType; // <-- ADD THIS

  // ✅ Define emojis
  const voteEmoji = "https://res.cloudinary.com/dnhq4fcyp/image/upload/v1717423963/wolfvote2_ba9iir.webp";
  const wolfVoteEmoji = "https://res.cloudinary.com/dnhq4fcyp/image/upload/v1717423963/wolfvote2_ba9iir.webp";

  return (
    <Tooltip content={wolfVote ? t("game.tooltip.wolfVoteAgainst") : t("game.tooltip.voteAgainst")} color="secondary" variant="flat">
      <div
        onClick={() => activateSelection(wolfVote ? "wolfVote" : "vote", wolfVote ? wolfVoteEmoji : voteEmoji)} // ✅ Pass emoji
        className={`${actionType === (wolfVote ? "wolfVote" : "vote") ? "bg-green-600 hover:bg-green-500" : "bg-slate-900 hover:bg-slate-700 animate-pulse"} ${divActionIcon}`}
      >
        <Image src={wolfVote ? wolfVoteEmoji : voteEmoji} alt="voteAgainst" width={50} height={50} style={{ height: "auto", width: "auto" }} className={imgActionIcon} />
      </div>
    </Tooltip>
  );
};

export default CmdVote;
