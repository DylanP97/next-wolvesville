"use client";

import { Tooltip } from "@nextui-org/react";
import HamburgerIcon from "./icons/HamburgerIcon";
import { useToRender } from "../providers/RenderProvider";
import { divActionIcon, getBtnClassNames } from "../lib/styles";
import { useTranslation } from "react-i18next";

const GameMenuExitBtn = () => {
  const { toggleExitMenu } = useToRender();
  const { t } = useTranslation();

  return (
    <Tooltip content={t("settings")} color="secondary" variant="flat">

      <div
        onClick={toggleExitMenu}
        className={`${toggleExitMenu ? "bg-slate-500 hover:bg-slate-400" : "bg-secondary hover:bg-slate-400"
          } ${divActionIcon}`}
      >
        <HamburgerIcon />

      </div>
    </Tooltip>
  );
};

export default GameMenuExitBtn;
