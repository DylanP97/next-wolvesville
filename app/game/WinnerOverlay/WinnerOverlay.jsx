"use client";

import Image from "next/image";
import { Button, Divider } from "@nextui-org/react";
import { useAuth } from "../../providers/AuthProvider";
import { useGame } from "../GameProvider";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import i18n from "../../lib/i18n";
import { fetchTeams } from "../../lib/fetch";
import AvatarAndRole from "./AvatarAndRole";
import { btnClassNames } from "../../lib/styles";

const WinnerOverlay = () => {
  const { t } = useTranslation();
  const { updateUserGameState, socket } = useAuth();
  const { winningTeam, playersList, gameId } = useGame();
  const [wTeamData, setWTeamData] = useState();

  const handleExitGame = () => {
    updateUserGameState(null, false);
    // document.location.assign("/");
    // socket.emit("deleteRoom", gameId);
  };

  useEffect(() => {
    const fetchAndSetTeamData = async () => {
      try {
        const teamsData = await fetchTeams();
        // console.log("teamsData", teamsData)
        if (winningTeam) {
          setWTeamData(
            teamsData.find((team) => team.name === winningTeam.name)
          );
          // console.log("wTeamData", wTeamData)
        }
      } catch (error) {
        console.error("Failed to fetch teams data", error);
      }
    };

    fetchAndSetTeamData();
  }, []);

  if (winningTeam && wTeamData) {
    return (
      // <div className="winner-overlay fixed inset-0 bg-black/60 overflow-y-auto flex justify-center p-4">
      <div
        id="winner-message"
        className="winner-message w-full p-4 m-2 bg-gray-800 rounded-lg overflow-y-auto">

        {/* Winning team row */}
        <div className="flex items-center gap-2">
          <Image
            src={winningTeam.image}
            alt="winner"
            height={24}
            width={24}
            className="w-6 h-6"
          />
          <p className="text-xs">
            {i18n.language === "fr"
              ? wTeamData.winHeadlineFR
              : wTeamData.winHeadline}
          </p>
        </div>
        <Divider className="my-4" />
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 w-full min-w-0">
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
        <Divider className="my-4" />



        {/* alive but losers */}
        {playersList.filter((ply) => ply.isAlive && !winningTeam.winnerPlayers.some(winner => winner.name === ply.name)).length > 0 && (
          <>
            <div className="flex flex-col justify-center my-2">
              <div className="flex items-center gap-2">
                {/* <Image
                    src="https://res.cloudinary.com/dnhq4fcyp/image/upload/v1717509814/grave_nmqqmp.png"
                    alt="graveyard"
                    height={24}
                    width={24}
                    className="w-6 h-6"
                  /> */}
                <p className="text-xs">{t("winnerOverlay.aliveButLosers")}</p>
              </div>
              <Divider className="my-4" />

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 w-full min-w-0">
                {playersList
                  .filter((ply) => ply.isAlive && !winningTeam.winnerPlayers.some(winner => winner.name === ply.name))
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
            <Divider className="my-4" />
          </>
        )}


        {/* Graveyard */}
        <div className="flex flex-col justify-center my-2">
          <div className="flex items-center gap-2">
            <Image
              src="https://res.cloudinary.com/dnhq4fcyp/image/upload/v1717509814/grave_nmqqmp.png"
              alt="graveyard"
              height={24}
              width={24}
              className="w-6 h-6"
            />
            <p className="text-xs">{t("winnerOverlay.graveyard")}</p>
          </div>
          <Divider className="my-4" />

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 w-full min-w-0">
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


        {/* quitgame button */}
        <Button
          color="primary"
          variant="shadow"
          onClick={() => handleExitGame()}
          size="lg"
          className={"flex-1 font-wolf mt-4"}
        >
          {t("gobackmenu")}
        </Button>
      </div>
      // </div>
    );
  }
};

export default WinnerOverlay;