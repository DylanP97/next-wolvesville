"use client";

import { Tooltip } from "@nextui-org/react";
import HamburgerIcon from "./icons/HamburgerIcon";
import { useToRender } from "../../providers/RenderProvider";
import { divActionIcon, getBtnClassNames } from "../../lib/styles";

const TopExitMenuBtn = () => {
  const { toggleExitMenu } = useToRender();

  return (
    <Tooltip content={("Settings or Quit Game")} color="secondary" variant="flat">

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

export default TopExitMenuBtn;
