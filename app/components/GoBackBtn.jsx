"use client";

import { Button } from "@nextui-org/react";
import { useTranslation } from "react-i18next";
import { useToRender } from "../providers/RenderProvider";
import Page from "../page";
import HomePage from "../homepage/HomePage";
import { useAuth } from "../providers/AuthProvider";

const GoBackBtn = () => {
  const { t } = useTranslation();
  const { setActiveComponent } = useToRender();
  const { username, isInRoom, avatar } = useAuth();

  return (
    <Button
      className="hover:animate-pulse hover:scale-[105%] w-60 transition-all"
      color="secondary"
      variant="solid"
      onClick={() =>
        setActiveComponent(
          <HomePage username={username} isInRoom={isInRoom} avatar={avatar} />
        )
      }
    >
      {t("goback")}
    </Button>
  );
};

export default GoBackBtn;
