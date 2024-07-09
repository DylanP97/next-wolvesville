"use client";

import Image from "next/image";
import { Button } from "@nextui-org/react";
import { useAuth } from "../../providers/AuthProvider";
import { useGame } from "../providers/GameProvider";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import i18n from "../../lib/i18n";
import { fetchTeams } from "../../lib/fetch";
import AvatarAndRole from "./WinnerOverlay/AvatarAndRole";

const WinnerOverlay = () => {
  const { t } = useTranslation();
  const { updateGameState, socket } = useAuth();
  const { winningTeam, playersList, gameId } = useGame();
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
  }, []);

  if (winningTeam && wTeamData) {
    return (
      <div className="winner-overlay">
        <div
          id="winner-message"
          className="winner-message flex flex-col justify-center relative"
        >
          <div className="flex items-center gap-2">
            <Image
              src={winningTeam.image}
              alt="winner"
              height={40}
              width={40}
              style={{ height: "auto", width: "auto" }}
              className="w-6 h-6"
            />
            <p className="text-sm">
              {i18n.language === "fr"
                ? wTeamData.winHeadlineFR
                : wTeamData.winHeadline}
            </p>
          </div>
          <div className="flex flex-row justify-center mt-4">
            {winningTeam.winnerPlayers.map((ply) => {
              return (
                <AvatarAndRole
                  ply={ply}
                  alive={true}
                  key={ply.name + "--wo-div"}
                />
              );
            })}
          </div>
          <div className="flex flex-col justify-center mt-4">
            <div className="flex items-center gap-2">
              <Image
                src="https://res.cloudinary.com/dnhq4fcyp/image/upload/v1717509814/grave_nmqqmp.png"
                alt="graveyard"
                height={40}
                width={40}
                style={{ height: "auto", width: "auto" }}
                className="w-6 h-6"
              />
              <p className="text-sm">{t("winnerOverlay.graveyard")}</p>
            </div>
            <div className="flex flex-row justify-center mt-4">
              {playersList
                .filter((ply) => !ply.isAlive)
                .map((ply) => {
                  return (
                    <AvatarAndRole
                      ply={ply}
                      alive={false}
                      key={ply.name + "--wo-div"}
                    />
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
          <Image
            src="https://res.cloudinary.com/dnhq4fcyp/image/upload/v1720534502/eye_yee8gi.png"
            alt="eyec"
            height={40}
            width={40}
            style={{ height: "auto", width: "auto" }}
            className={`w-6 h-6 absolute top-2 right-2 eyeImage`}
            id="winner-overlay-eyec"
          />
        </div>
      </div>
    );
  }
};

export default WinnerOverlay;
