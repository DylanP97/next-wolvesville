"use client";

import Image from "next/image";
import { Tooltip } from "@nextui-org/react";
import voteAgainstIcon from "../../../../../public/game/vote-time.png";
import { useTranslation } from "react-i18next";
import { divActionIcon, imgActionIcon } from "../../../../lib/styles";

const CmdVote = ({ activateSelection, isSelection, wolfVote }) => {
  const { t } = useTranslation();

  return (
    <Tooltip
      content={t("game.tooltip.voteAgainst")}
      color="secondary"
      variant="flat"
    >
      <div
        onClick={() => activateSelection(wolfVote ? "wolfVote" : "vote")}
        className={`${
          isSelection ? "bg-slate-900" : "bg-red-800 hover:bg-red-600"
        } ${divActionIcon}`}
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
          className={`${imgActionIcon}`}
        />
      </div>
    </Tooltip>
  );
};

export default CmdVote;
