"use client";

import { Button } from "@nextui-org/react";
import { useTranslation } from "react-i18next";
import { useToRender } from "../providers/RenderProvider";
import HomePage from "../homepage/HomePage";
import { useAuth } from "../providers/AuthProvider";
import { btnClassNames, getBtnClassNames } from "../lib/styles";

const GoBackBtn = () => {
  const { t } = useTranslation();
  const { setActiveComponent } = useToRender();
  const { username, isInRoom, avatar, updateUserGameState } = useAuth();

  return (
    <Button
      className={getBtnClassNames('w-40')}
      color="secondary"
      variant="shadow"
      onClick={() => {
        updateUserGameState(null, false, null)
        setActiveComponent(
          <HomePage username={username} isInRoom={isInRoom} avatar={avatar} />
        )
      }
      }
    >
      {t("gobackmenu")}
    </Button >
  );
};

export default GoBackBtn;
