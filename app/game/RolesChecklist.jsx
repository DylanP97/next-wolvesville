"use client";

import { Button } from "@nextui-org/react";
import { useGame } from "./GameProvider";
import { useAuth } from "../providers/AuthProvider";
import CrossIcon from "../components/icons/CrossIcon";
import { useTranslation } from "react-i18next";
import i18n from "../lib/i18n";
import Image from "next/image";

const teamConfig = {
  village: {
    bg: "bg-emerald-950/30",
    border: "border-emerald-500/30",
    titleColor: "text-emerald-300",
    icon: "\u{1F3E0}",
  },
  werewolves: {
    bg: "bg-red-950/30",
    border: "border-red-500/30",
    titleColor: "text-red-300",
    icon: "\u{1F43A}",
  },
  solo: {
    bg: "bg-violet-950/30",
    border: "border-violet-500/30",
    titleColor: "text-violet-300",
    icon: "\u{1F3AD}",
  },
};

const RolesChecklist = ({ rolesChecklistOpen, setRolesChecklistOpen }) => {
  const { t } = useTranslation();
  const { game } = useAuth();
  const { playersList } = useGame();

  const rolesInGame = game?.rolesInGame || [];

  // Build set of discovered role names
  const discoveredRoles = new Set();
  playersList.forEach((p) => {
    if (p.isRevealed && p.role?.name) {
      discoveredRoles.add(p.role.name);
    }
  });

  // Group roles by team
  const groupedRoles = { village: [], werewolves: [], solo: [] };
  rolesInGame.forEach((role) => {
    if (role.team === "Werewolves") {
      groupedRoles.werewolves.push(role);
    } else if (role.team === "Village" || role.team === "Villagers") {
      groupedRoles.village.push(role);
    } else {
      groupedRoles.solo.push(role);
    }
  });

  const TeamSection = ({ roles, teamType }) => {
    const styles = teamConfig[teamType];
    if (!roles.length) return null;

    return (
      <div className={`rounded-xl p-3 ${styles.bg} border ${styles.border} mb-3`}>
        <h4 className={`${styles.titleColor} text-sm font-bold mb-2 flex items-center gap-2 font-wolf`}>
          <span>{styles.icon}</span>
          {teamType === "village"
            ? t("teams.village") || "Village"
            : teamType === "werewolves"
            ? t("teams.werewolves") || "Werewolves"
            : t("teams.solo") || "Solo"}
          <span className="text-xs font-normal opacity-60 font-sans">
            ({roles.length})
          </span>
        </h4>
        <div className="flex flex-col gap-1">
          {roles.map((role, index) => {
            const isDiscovered = discoveredRoles.has(role.name);
            return (
              <div
                key={`${role.name}-${index}`}
                className={`flex items-center gap-2 px-2 py-1 rounded-lg ${
                  isDiscovered ? "opacity-40" : ""
                }`}
              >
                {role.image && (
                  <Image
                    src={role.image}
                    alt={role.name}
                    width={24}
                    height={24}
                    className="rounded-full"
                  />
                )}
                <span
                  className={`text-sm text-white ${
                    isDiscovered ? "line-through" : ""
                  }`}
                >
                  {i18n.language === "fr" ? role.nameFR : role.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-background w-[30%] min-w-[250px] rounded-l-3xl flex flex-col absolute top-0 right-0 z-40 p-4 overflow-y-auto max-h-[90vh] mt-4">
      <div className="mb-2 flex flex-row w-full items-center justify-items-stretch">
        <h3 className="flex-grow font-bold font-wolf">
          {t("game.rolesChecklist") || "Roles"}
        </h3>
        <Button
          color="secondary"
          variant="solid"
          onClick={() => setRolesChecklistOpen(false)}
          isIconOnly
        >
          <CrossIcon />
        </Button>
      </div>

      <TeamSection roles={groupedRoles.village} teamType="village" />
      <TeamSection roles={groupedRoles.werewolves} teamType="werewolves" />
      <TeamSection roles={groupedRoles.solo} teamType="solo" />
    </div>
  );
};

export default RolesChecklist;
