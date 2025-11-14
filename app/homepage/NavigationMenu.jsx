"use client";

import { useTranslation } from "react-i18next";
import { useAuth } from "../providers/AuthProvider";
import CreateRoom from "../CreateRoom";
import ConnectedUsers from "../ConnectedUsers";
import JoinRoom from "../JoinRoom";
import RolesGrid from "../RolesGrid";
import Profile from "../Profile";
import { getBtnClassNames } from "../lib/styles";
import { useToRender } from "../providers/RenderProvider";
import { Button } from "@nextui-org/react";

const NavigationMenu = () => {
  const { t } = useTranslation();
  const { isGuest, socket, username, socketId, avatar } = useAuth();
  const { setActiveComponent, activeComponent } = useToRender();

  const launchQuickGame = async () => {
    console.log("launchQuickGame", username, socketId, avatar)
    await socket.emit("startQuickGame", username, socketId, avatar);
  }

  const components = [
    {
      label: t("menu.2"),
      componentToReturn: (
        <CreateRoom
        // setActiveComponent={setActiveComponent}
        // activeComponent={activeComponent}
        />
      ),
      allowedForGuest: true,
    },
    {
      label: t("menu.1"),
      componentToReturn: (
        <JoinRoom
        // setActiveComponent={setActiveComponent}
        // activeComponent={activeComponent}
        />
      ),
      allowedForGuest: true,
    },
    {
      label: t("menu.3"),
      componentToReturn: (
        <ConnectedUsers
        // setActiveComponent={setActiveComponent}
        // activeComponent={activeComponent}
        />
      ),
      allowedForGuest: true,
    },
    {
      label: t("menu.4"),
      componentToReturn: (
        <RolesGrid
        // setActiveComponent={setActiveComponent}
        // activeComponent={activeComponent}
        />
      ),
      allowedForGuest: true,
    },
    {
      label: t("menu.5"),
      componentToReturn: (
        <Profile
        // setActiveComponent={setActiveComponent}
        // activeComponent={activeComponent}
        />
      ),
      allowedForGuest: false,
    },
  ];

  const filteredComponents = components.filter((c) =>
    isGuest ? c.allowedForGuest : true
  );

  return (
    <div className="w-full h-full">
      <nav className="absolute top-1/3 flex flex-col items-center py-4 w-full z-20">
        <Button
          className={getBtnClassNames("w-80") + " text-md font-medium h-12 font-wolf"}
          color="primary"
          variant="shadow"
          onClick={() => launchQuickGame()}
          key={"quickGame-navComponent"}
        >
          {t("menu.0")}
        </Button>
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
    </div>
  );
};

export default NavigationMenu;
