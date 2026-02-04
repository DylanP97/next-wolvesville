"use client";

import { useTranslation } from "react-i18next";
import { useAuth } from "../providers/AuthProvider";
import CreateRoom from "../CreateRoom";
import ConnectedUsers from "../ConnectedUsers";
import JoinRoom from "../join-room/JoinRoom";
import RolesGrid from "../RolesGrid";
import Profile from "../profile/Profile";
import Matchmaking from "../Matchmaking";
import { useToRender } from "../providers/RenderProvider";
import { Button } from "@nextui-org/react";

const NavigationMenu = () => {
  const { t, i18n } = useTranslation();
  const { isGuest, socket, username, socketId, avatar, isInRoom } = useAuth();
  const { setActiveComponent } = useToRender();

  const launchQuickGame = async () => {
    await socket.emit("startQuickGame", username, socketId, avatar, i18n.language || 'fr');
  };

  const components = [
    {
      label: t("menu.soloQuickGame") || "Solo Quick Game",
      group: "play",
      isQuickGame: true,
      allowedForGuest: true,
      hideWhenInRoom: true,
    },
    {
      label: t("menu.matchmaking") || "Matchmaking",
      componentToReturn: <Matchmaking />,
      group: "play",
      allowedForGuest: true,
      hideWhenInRoom: true,
    },
    {
      label: t("menu.2"),
      componentToReturn: <CreateRoom />,
      group: "play",
      allowedForGuest: true,
      hideWhenInRoom: true,
    },
    {
      label: t("menu.1"),
      componentToReturn: <JoinRoom />,
      group: "play",
      allowedForGuest: true,
    },
    {
      label: t("menu.3"),
      componentToReturn: <ConnectedUsers />,
      group: "explore",
      allowedForGuest: true,
    },
    {
      label: t("menu.4"),
      componentToReturn: <RolesGrid />,
      group: "explore",
      allowedForGuest: true,
    },
    {
      label: t("menu.5"),
      componentToReturn: <Profile />,
      group: "explore",
      allowedForGuest: false,
    },
  ];

  const filtered = components.filter(
    (c) => (isGuest ? c.allowedForGuest : true) && !(isInRoom && c.hideWhenInRoom)
  );

  const playItems = filtered.filter((c) => c.group === "play");
  const exploreItems = filtered.filter((c) => c.group === "explore");

  // Split play items into two rows
  const playRow1 = playItems.filter(
    (c) => c.isQuickGame || c.componentToReturn?.type === Matchmaking
  );
  const playRow2 = playItems.filter(
    (c) => !c.isQuickGame && c.componentToReturn?.type !== Matchmaking
  );

  const handleClick = (item) => {
    if (item.isQuickGame) {
      launchQuickGame();
    } else {
      setActiveComponent(item.componentToReturn);
    }
  };

  return (
    <nav className="flex flex-col flex-1 py-4 items-center w-full z-40 gap-2">
      {/* Play Section */}
      {playItems.length > 0 && (
        <div className="w-full max-w-[22rem] px-4">
          <h2 className="text-xs uppercase tracking-widest text-slate-400 mb-2">
            {t("menu.playSection")}
          </h2>

          {/* Row 1: Solo Quick Game + Matchmaking (primary, stronger) */}
          {playRow1.length > 0 && (
            <div className={`grid ${playRow1.length > 1 ? "grid-cols-2" : "grid-cols-1"} gap-3 mb-3`}>
              {playRow1.map((item, i) => (
                <Button
                  key={`play-row1-${i}`}
                  className="h-14 text-sm font-bold"
                  color="primary"
                  variant="shadow"
                  onPress={() => handleClick(item)}
                >
                  {item.label}
                </Button>
              ))}
            </div>
          )}

          {/* Row 2: Create Room + Join Room (primary, subtler) */}
          {playRow2.length > 0 && (
            <div className={`grid ${playRow2.length > 1 ? "grid-cols-2" : "grid-cols-1"} gap-3`}>
              {playRow2.map((item, i) => (
                <Button
                  key={`play-row2-${i}`}
                  className="h-12 text-sm font-medium bg-white/10 text-white hover:bg-white/20"
                  variant="flat"
                  onPress={() => handleClick(item)}
                >
                  {item.label}
                </Button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Divider */}
      {exploreItems.length > 0 && (
        <div className="w-full max-w-[22rem] px-4 border-t border-slate-700/50 mt-3 pt-3">
          <h2 className="text-xs uppercase tracking-widest text-slate-400 mb-2">
            {t("menu.exploreSection")}
          </h2>
          <div className={`grid ${exploreItems.length > 2 ? "grid-cols-3" : "grid-cols-2"} gap-2`}>
            {exploreItems.map((item, i) => (
              <Button
                key={`explore-${i}`}
                className="h-10 text-xs font-medium bg-white/10 text-white/80 hover:bg-white/20 hover:text-white"
                variant="flat"
                onPress={() => handleClick(item)}
              >
                {item.label}
              </Button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavigationMenu;
