"use client";

import { Button } from "@nextui-org/react";
import HamburgerIcon from "./icons/HamburgerIcon";
import { useToRender } from "../../providers/RenderProvider";
import { getBtnClassNames } from "../../lib/styles";

const TopExitMenuBtn = () => {
  const { toggleExitMenu } = useToRender();

  return (
    <Button
      isIconOnly
      size="sm"
      className={getBtnClassNames("w-10")}
      variant="solid"
      color="secondary"
      aria-label="topExitMenuBtn"
      onPress={toggleExitMenu}
    >
      <HamburgerIcon />
    </Button>
  );
};

export default TopExitMenuBtn;
