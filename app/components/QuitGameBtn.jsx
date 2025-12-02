"use client";

import { Button } from "@nextui-org/react";
import { useTranslation } from "react-i18next";
import { useToRender } from "../providers/RenderProvider";
import HomePage from "../homepage/HomePage";
import { useAuth } from "../providers/AuthProvider";
import { getBtnClassNames } from "../lib/styles";

const QuitGameBtn = () => {
    const { t } = useTranslation();
    const { setActiveComponent } = useToRender();
    const { username, isInRoom, avatar, updateUserGameState } = useAuth();

    return (
        <Button
            className={getBtnClassNames('w-40')}
            color="secondary"
            variant="shadow"
            onClick={() => {
                updateUserGameState(null, false)
                setActiveComponent(
                    <HomePage username={username} isInRoom={isInRoom} avatar={avatar} />
                )
            }
            }
        >
            {t("quitgame")}
        </Button >
    );
};

export default QuitGameBtn;
