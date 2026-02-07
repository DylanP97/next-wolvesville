"use client";

import RoleCard from "./RoleCard";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { fetchRoles } from "./lib/fetch";
import { Button } from "@nextui-org/react";
import { getBtnClassNames } from "./lib/styles";
import i18n from "./lib/i18n";

const teamOrder = ["Village", "Werewolves", "Solo"];

const teamStyles = {
  Village: {
    gradient: "from-emerald-500/20 to-emerald-900/10",
    border: "border-emerald-500/30",
    text: "text-emerald-400",
    badge: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    icon: "🏘️",
  },
  Werewolves: {
    gradient: "from-red-500/20 to-red-900/10",
    border: "border-red-500/30",
    text: "text-red-400",
    badge: "bg-red-500/20 text-red-300 border-red-500/30",
    icon: "🐺",
  },
  Solo: {
    gradient: "from-violet-500/20 to-violet-900/10",
    border: "border-violet-500/30",
    text: "text-violet-400",
    badge: "bg-violet-500/20 text-violet-300 border-violet-500/30",
    icon: "🎭",
  },
};

const RolesGrid = ({ onBack }) => {
  const [availableRoles, setAvailableRoles] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const { t } = useTranslation();
  const isFr = i18n.language === "fr";

  useEffect(() => {
    const fetchData = async () => {
      const rolesData = await fetchRoles();
      setAvailableRoles(rolesData);
    };

    fetchData();
  }, []);

  const filtered = availableRoles.filter((role) => role.status === 1);

  // Normalize team: anything not "Village" or "Werewolves" is "Solo"
  const getTeamGroup = (role) => {
    const team = role.team || "";
    if (team === "Village" || team === "Villagers") return "Village";
    if (team === "Werewolves") return "Werewolves";
    return "Solo";
  };

  // Group by team
  const grouped = {};
  filtered.forEach((role) => {
    const team = getTeamGroup(role);
    if (!grouped[team]) grouped[team] = [];
    grouped[team].push(role);
  });

  const teamsToShow = selectedTeam
    ? [selectedTeam]
    : teamOrder.filter((t) => grouped[t]?.length > 0);

  const teamLabels = {
    Village: isFr ? "Village" : "Village",
    Werewolves: isFr ? "Loups-Garous" : "Werewolves",
    Solo: isFr ? "Solo" : "Solo",
  };

  return (
    <section className="flex flex-col w-full p-4 pt-[70px] mb-12 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col items-center mb-8">
        <h1 className="text-white text-4xl font-bold font-wolf tracking-wide mb-2">
          {t("roles.title")}
        </h1>
        <p className="text-slate-400 text-sm">
          {filtered.length} {isFr ? "roles disponibles" : "roles available"}
        </p>
      </div>

      {/* Team filter tabs */}
      <div className="flex justify-center gap-2 mb-8 flex-wrap">
        <button
          onClick={() => setSelectedTeam(null)}
          className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
            selectedTeam === null
              ? "bg-white/15 text-white border-white/30"
              : "bg-transparent text-slate-400 border-slate-700 hover:border-slate-500 hover:text-slate-200"
          }`}
        >
          {isFr ? "Tous" : "All"}
        </button>
        {teamOrder.map((team) => {
          if (!grouped[team]?.length) return null;
          const style = teamStyles[team];
          return (
            <button
              key={team}
              onClick={() => setSelectedTeam(selectedTeam === team ? null : team)}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition-all flex items-center gap-1.5 ${
                selectedTeam === team
                  ? `${style.badge} border`
                  : "bg-transparent text-slate-400 border-slate-700 hover:border-slate-500 hover:text-slate-200"
              }`}
            >
              <span>{style.icon}</span>
              {teamLabels[team]}
              <span className="text-xs opacity-60">({grouped[team].length})</span>
            </button>
          );
        })}
      </div>

      {/* Roles grouped by team */}
      {teamsToShow.map((team) => {
        const style = teamStyles[team] || teamStyles.Solo;
        const roles = grouped[team] || [];
        if (roles.length === 0) return null;

        return (
          <div key={team} className="mb-10">
            {/* Team section header */}
            <div className={`flex items-center gap-3 mb-4 pb-3 border-b ${style.border}`}>
              <span className="text-2xl">{style.icon}</span>
              <h2 className={`text-xl font-bold font-wolf tracking-wide ${style.text}`}>
                {teamLabels[team]}
              </h2>
              <span className="text-xs text-slate-500 ml-auto">
                {roles.length} {roles.length > 1 ? "roles" : "role"}
              </span>
            </div>

            {/* Roles grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {roles
                .sort((a, b) => (a.name || "").localeCompare(b.name || ""))
                .map((role) => (
                  <RoleCard key={role.name} role={role} teamStyle={style} />
                ))}
            </div>
          </div>
        );
      })}

      {/* Back button */}
      {onBack && (
        <div className="flex justify-center mt-6">
          <Button
            className={getBtnClassNames("w-80")}
            color="secondary"
            variant="shadow"
            onClick={onBack}
          >
            {t("goback")}
          </Button>
        </div>
      )}
    </section>
  );
};

export default RolesGrid;
