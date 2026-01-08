"use client";

import { Button } from "@nextui-org/react";
import { useTranslation } from "react-i18next";
import { useToRender } from "../providers/RenderProvider";
import HomePage from "../homepage/HomePage";
import { useAuth } from "../providers/AuthProvider";
import { getBtnClassNames } from "../lib/styles";
import { useEffect } from "react";

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
        updateUserGameState(isInRoom, false)
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
