"use client";

import Image from "next/image";
import AvatarUI from "../../profile/components/AvatarUI";
import { Button } from "@nextui-org/react";
import { useAuth } from "../../providers/AuthProvider";
import { useGame } from "../providers/GameProvider";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import i18n from "../../lib/i18n";
import fetchTeams from "../../lib/fetch";

const WinnerOverlay = () => {
  const { t } = useTranslation();
  const { updateGameState, socket } = useAuth();
  const { winningTeam, aliveList, playersList, gameId } = useGame();
  const [wTeamData, setWTeamData] = useState();

  const handleExitGame = () => {
    updateGameState(null, false, null);
    document.location.assign("/");
    socket.emit("deleteRoom", gameId);
  };
  useEffect(() => {
    const fetchAndSetTeamData = async () => {
      try {
        const teamsData = await fetchTeams();
        setWTeamData(teamsData.find((team) => team.name === winningTeam.name));
      } catch (error) {
        console.error("Failed to fetch teams data", error);
      }
    };

    fetchAndSetTeamData();
  }, [winningTeam]); // Ajoutez winningTeam comme dépendance si nécessaire

  if (winningTeam && wTeamData) {
    return (
      <div
        className="winner-overlay"
        style={{
          zIndex: 999,
        }}
      >
        <div className="winner-message flex flex-col justify-center align-center">
          <div className="flex items-end gap-2">
            <Image
              src={winningTeam.image}
              alt="winner"
              height={60}
              width={60}
              className="w-8 h-8"
              style={{ height: "auto", width: "auto" }}
            />
            <p className="mb-4">
              {/* ajouter db headline : headlineFR */}
              {i18n.language === "fr"
                ? wTeamData.headlineFR
                : wTeamData.headline}
            </p>
          </div>
          <div className="flex flex-row justify-center mt-4">
            {winningTeam.winnerPlayers.map((ply) => {
              return (
                <div
                  key={ply.name + "key-win-div"}
                  className="flex flex-col items-center w-44"
                >
                  <div className="flex relative">
                    <Image
                      src={ply.role.image}
                      alt={ply.role.name + "win-icon-76678"}
                      height={40}
                      width={40}
                      style={{ height: "auto", width: "auto" }}
                      className="p-2 absolute top-[-15%] left-[55%] "
                    />
                    <div className="p-2 rounded-full ">
                      {ply.avatar ? (
                        <AvatarUI heightAndWidth={80} avatar={ply.avatar} />
                      ) : (
                        <Image
                          src="https://res.cloudinary.com/dnhq4fcyp/image/upload/v1717510105/cpu_ir0roq.png"
                          height={80}
                          width={80}
                          alt="cpu-player-avatar"
                        />
                      )}
                    </div>
                  </div>
                  <p className="m-2 text-gray-200 text-sm text-clip italic">
                    {ply.name} {t("winnerOverlay.as")} {ply.role.name}
                  </p>
                </div>
              );
            })}
          </div>
          <div className="flex flex-col justify-center mt-4">
            <div className="flex items-end gap-2">
              <Image
                src="https://res.cloudinary.com/dnhq4fcyp/image/upload/v1717509814/grave_nmqqmp.png"
                alt="graveyard"
                height={60}
                width={60}
                className="w-8 h-8"
                style={{ height: "auto", width: "auto" }}
              />
              <p className="mb-4">{t("winnerOverlay.graveyard")}</p>
            </div>
            <div className="flex flex-row justify-center mt-4">
              {playersList
                .filter((ply) => !ply.isAlive)
                .map((ply) => {
                  return (
                    <div
                      key={ply.name + "key-win-div"}
                      className="flex flex-col items-center w-44"
                    >
                      <div className="flex relative">
                        <Image
                          src={ply.role.image}
                          alt={ply.role.name + "win-icon-76678"}
                          height={40}
                          width={40}
                          style={{ height: "auto", width: "auto" }}
                          className="p-2 absolute top-[-15%] left-[55%] "
                        />
                        <div className="p-2 rounded-full ">
                          {ply.avatar ? (
                            <AvatarUI heightAndWidth={60} avatar={ply.avatar} />
                          ) : (
                            <Image
                              src="https://res.cloudinary.com/dnhq4fcyp/image/upload/v1715954141/robot-game_ncwkv7.png"
                              height={60}
                              width={60}
                              alt="cpu-player-avatar"
                            />
                          )}
                        </div>
                      </div>
                      <p className="m-2 text-gray-200 text-xs text-clip italic">
                        {ply.name} {t("winnerOverlay.wasA")} {ply.role.name}
                      </p>
                    </div>
                  );
                })}
            </div>
          </div>
          <Button
            className="bg-background hover:animate-pulse hover:scale-[105%] w-60 transition-all text-white mt-4"
            variant="solid"
            onClick={() => handleExitGame()}
          >
            {t("goback")}
          </Button>
        </div>
      </div>
    );
  }
};

export default WinnerOverlay;
