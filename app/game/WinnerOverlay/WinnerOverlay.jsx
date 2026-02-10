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
import GameTimeline from "./GameTimeline";
import GameStats from "./GameStats";
import GameHighlights from "./GameHighlights";

const WinnerOverlay = () => {
  const { t } = useTranslation();
  const { updateUserGameState, socket } = useAuth();
  const { winningTeam, playersList, gameId, roleActions, gameTimeline, startTime, hasEnded, dayCount, highlightsData } = useGame();
  const [wTeamData, setWTeamData] = useState();
  const [activeTab, setActiveTab] = useState("results");

  const isFr = i18n.language === "fr";

  const handleExitGame = () => {
    updateUserGameState(null, false);
  };

  useEffect(() => {
    const fetchAndSetTeamData = async () => {
      try {
        const teamsData = await fetchTeams();
        if (winningTeam) {
          setWTeamData(
            teamsData.find((team) => team.name === winningTeam.name)
          );
        }
      } catch (error) {
        console.error("Failed to fetch teams data", error);
      }
    };

    fetchAndSetTeamData();
  }, []);

  if (winningTeam && wTeamData) {
    const tabs = [
      { key: "results", label: isFr ? "Resultats" : "Results", icon: "🏆" },
      { key: "timeline", label: isFr ? "Chronologie" : "Timeline", icon: "📜" },
      { key: "stats", label: isFr ? "Statistiques" : "Stats", icon: "📊" },
      { key: "mvp", label: "MVP", icon: "⭐" },
    ];

    return (
      <div
        id="winner-message"
        className="winner-message p-4 m-2 bg-gray-800 rounded-lg overflow-y-auto">

        {/* Tab bar */}
        <div className="flex gap-1 mb-4 bg-slate-900/50 rounded-lg p-1">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 py-2 px-3 text-xs font-medium rounded-md transition-all ${
                activeTab === tab.key
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-700/50"
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Results tab (existing content) */}
        {activeTab === "results" && (
          <>
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
                {isFr
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
          </>
        )}

        {/* Timeline tab */}
        {activeTab === "timeline" && (
          <GameTimeline timeline={gameTimeline} />
        )}

        {/* Stats tab */}
        {activeTab === "stats" && (
          <GameStats
            roleActions={roleActions}
            startTime={startTime}
            hasEnded={hasEnded}
            dayCount={dayCount}
          />
        )}

        {/* MVP tab */}
        {activeTab === "mvp" && (
          <GameHighlights highlightsData={highlightsData} />
        )}

        {/* quitgame button */}
        <Button
          color="primary"
          variant="shadow"
          onClick={() => handleExitGame()}
          size="lg"
          className={"flex-1 font-wolf mt-4 w-full"}
        >
          {t("gobackmenu")}
        </Button>
      </div>
    );
  }
};

export default WinnerOverlay;
