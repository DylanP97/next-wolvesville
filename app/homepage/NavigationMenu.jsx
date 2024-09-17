"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../providers/AuthProvider";
import CreateRoom from "../CreateRoom";
import ConnectedUsers from "../ConnectedUsers";
import JoinRoom from "../JoinRoom";
import RolesGrid from "../RolesGrid";
import Profile from "../Profile";
import { btnClassNames } from "../lib/styles";

const NavigationMenu = ({
  setActiveComponent,
}) => {
  const { t } = useTranslation();
  const { isGuest } = useAuth();

  const components = [
    {
      label: t("menu.2"),
      componentToReturn: <CreateRoom />,
      allowedForGuest: true,
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

  const filteredComponents = components.filter((c) =>
    isGuest ? c.allowedForGuest : true
  );

  return (
    <div className="w-full h-full">
      <nav className="absolute top-1/3 flex flex-col items-center py-4 w-full z-20">
        {filteredComponents.map((c, index) => (
          <div
            key={index + "-navComponent"}
            onClick={() => setActiveComponent(c.componentToReturn)}
            className={btnClassNames}
          >
            {c.label}
          </div>
        ))}
      </nav>
    </div>
  );
};

export default NavigationMenu;
