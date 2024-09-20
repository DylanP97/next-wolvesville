"use client";

import { useTranslation } from "react-i18next";
import { useAuth } from "../providers/AuthProvider";
import CreateRoom from "../CreateRoom";
import ConnectedUsers from "../ConnectedUsers";
import JoinRoom from "../JoinRoom";
import RolesGrid from "../RolesGrid";
import Profile from "../Profile";
import { btnClassNames } from "../lib/styles";
import { useToRender } from "../providers/RenderProvider";

const NavigationMenu = () => {
  const { t } = useTranslation();
  const { isGuest } = useAuth();
  const { setActiveComponent, activeComponent } = useToRender();

  const components = [
    {
      label: t("menu.2"),
      componentToReturn: (
        <CreateRoom
          setActiveComponent={setActiveComponent}
          activeComponent={activeComponent}
        />
      ),
      allowedForGuest: true,
    },
    {
      label: t("menu.1"),
      componentToReturn: (
        <JoinRoom
          setActiveComponent={setActiveComponent}
          activeComponent={activeComponent}
        />
      ),
      allowedForGuest: true,
    },
    {
      label: t("menu.3"),
      componentToReturn: (
        <ConnectedUsers
          setActiveComponent={setActiveComponent}
          activeComponent={activeComponent}
        />
      ),
      allowedForGuest: true,
    },
    {
      label: t("menu.4"),
      componentToReturn: (
        <RolesGrid
          setActiveComponent={setActiveComponent}
          activeComponent={activeComponent}
        />
      ),
      allowedForGuest: true,
    },
    {
      label: t("menu.5"),
      componentToReturn: (
        <Profile
          setActiveComponent={setActiveComponent}
          activeComponent={activeComponent}
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
