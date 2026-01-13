"use client";

import { useTranslation } from "react-i18next";
import { useAuth } from "../providers/AuthProvider";
import CreateRoom from "../CreateRoom";
import ConnectedUsers from "../ConnectedUsers";
import JoinRoom from "../join-room/JoinRoom";
import RolesGrid from "../RolesGrid";
import Profile from "../profile/Profile";
import Matchmaking from "../Matchmaking";
import { getBtnClassNames } from "../lib/styles";
import { useToRender } from "../providers/RenderProvider";
import { Button } from "@nextui-org/react";

const NavigationMenu = () => {
  const { t } = useTranslation();
  const { isGuest, socket, username, socketId, avatar, isInRoom } = useAuth();
  const { setActiveComponent, activeComponent } = useToRender();

  const launchQuickGame = async () => {
    await socket.emit("startQuickGame", username, socketId, avatar);
  }

  const components = [
    {
      label: t("menu.matchmaking") || "Matchmaking",
      componentToReturn: <Matchmaking />,
      allowedForGuest: true,
      hideWhenInRoom: true,
    },
    {
      label: t("menu.2"),
      componentToReturn: <CreateRoom />,
      allowedForGuest: true,
      hideWhenInRoom: true,
    },
    {
      label: t("menu.1"),
      componentToReturn: <JoinRoom />,
      allowedForGuest: true,
    },
    {
      label: t("menu.3"),
      componentToReturn: <ConnectedUsers />,
      allowedForGuest: true,
    },
    {
      label: t("menu.4"),
      componentToReturn: <RolesGrid />,
      allowedForGuest: true,
    },
    {
      label: t("menu.5"),
      componentToReturn: <Profile />,
      allowedForGuest: false,
    },
  ];

  const filteredComponents = components.filter(
    (c) => (isGuest ? c.allowedForGuest : true) && !(isInRoom && c.hideWhenInRoom)
  );

  return (
      <nav className="flex flex-col flex-1 py-4 items-center w-full z-40">
        {!isInRoom && (   // 👈 hide Solo Quick Game when in room
          <Button
            className={getBtnClassNames("w-80") + " text-md font-medium h-12 font-wolf"}
            color="secondary"
            variant="shadow"
            onClick={launchQuickGame}
            key={"soloQuickGame-navComponent"}
          >
            {t("menu.soloQuickGame") || "🎮 Solo Quick Game"}
          </Button>
        )}

        {filteredComponents.map((c, index) => (
          <Button
            className={getBtnClassNames("w-80") + " text-md font-medium h-12 font-wolf"}
            color="primary"
            variant="shadow"
            onClick={() => setActiveComponent(c.componentToReturn)}
            key={index + "-navComponent"}
          >
            {c.label}
          </Button>
        ))}
      </nav>
  );
};

export default NavigationMenu;
