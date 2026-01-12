"use client";

import Image from "next/image";
import send from "../../../public/game/paper-plane.png";
import { Tooltip } from "@nextui-org/react";
import { useTranslation } from "react-i18next";
import { divActionIcon, imgActionIcon } from "../../lib/styles";

const CmdSend = ({ sendMessage, message }) => {
  const { t } = useTranslation();

  return (
    <Tooltip content={t("game.sendMessage")} color="secondary" variant="flat">
      <div
        onClick={() => sendMessage(message)}
        className={`h-8 sm:h-10 w-8 sm:w-10 p-1 bg-blue-900 hover:bg-blue-700 ${divActionIcon}`}
      >
        <Image
          src={send}
          alt="send"
          width={32}
          height={32}
          style={{ height: "auto", width: "auto" }}
          className={`object-contain`}
        />
      </div>
    </Tooltip>
  );
};

export default CmdSend;
