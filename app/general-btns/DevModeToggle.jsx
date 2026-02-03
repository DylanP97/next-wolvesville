"use client";

import { useTranslation } from "react-i18next";
import { Button } from "@nextui-org/react";
import { Tooltip } from "@nextui-org/react";
import { useDevMode } from "../providers/DevModeProvider";
import { getBtnClassNames } from "../lib/styles";

const DevModeToggle = () => {
  const { t } = useTranslation();
  const { isDevMode, toggleDevMode } = useDevMode();

  return (
    <Tooltip content="Allow the developer to see additional information and tools" color="secondary" variant="faded">
      <span>
        <Button
          className={getBtnClassNames("w-36")}
          variant="solid"
          color={isDevMode ? "success" : "danger"}
          size="sm"
          aria-label="devModeToggle"
          onPress={toggleDevMode}
        >
          {isDevMode ? "Dev Mode: ON" : "Dev Mode: OFF"}
        </Button>
      </span>
    </Tooltip>
  );
};

export default DevModeToggle;

