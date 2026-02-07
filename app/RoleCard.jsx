"use client";

import NextImage from "next/image";
import i18n from "./lib/i18n";
import { useTranslation } from "react-i18next";

const teamColorMap = {
  Village: {
    border: "border-emerald-500/40",
    hoverBorder: "hover:border-emerald-400/70",
    accentBg: "bg-emerald-500/10",
    accentText: "text-emerald-400",
    glowShadow: "hover:shadow-emerald-500/20",
    tagBg: "bg-emerald-500/20",
    tagText: "text-emerald-300",
    tagBorder: "border-emerald-500/30",
    imageBorder: "border-emerald-500/50",
  },
  Werewolves: {
    border: "border-red-500/40",
    hoverBorder: "hover:border-red-400/70",
    accentBg: "bg-red-500/10",
    accentText: "text-red-400",
    glowShadow: "hover:shadow-red-500/20",
    tagBg: "bg-red-500/20",
    tagText: "text-red-300",
    tagBorder: "border-red-500/30",
    imageBorder: "border-red-500/50",
  },
  Solo: {
    border: "border-violet-500/40",
    hoverBorder: "hover:border-violet-400/70",
    accentBg: "bg-violet-500/10",
    accentText: "text-violet-400",
    glowShadow: "hover:shadow-violet-500/20",
    tagBg: "bg-violet-500/20",
    tagText: "text-violet-300",
    tagBorder: "border-violet-500/30",
    imageBorder: "border-violet-500/50",
  },
};

const getTeamGroup = (team) => {
  if (team === "Village" || team === "Villagers") return "Village";
  if (team === "Werewolves") return "Werewolves";
  return "Solo";
};

const RoleCard = ({ role }) => {
  const { t } = useTranslation();
  const isFr = i18n.language === "fr";

  const colors = teamColorMap[getTeamGroup(role.team)] || teamColorMap.Solo;
  const roleName = isFr ? role.nameFR || role.name : role.name;
  const roleDesc = isFr ? role.descriptionFR || role.description : role.description;
  const teamName = isFr ? role.teamFR || role.team : role.team;

  const abilities = [];
  if (role.canPerform1?.label) {
    abilities.push({
      label: isFr ? role.canPerform1.labelFR || role.canPerform1.label : role.canPerform1.label,
      emoji: role.canPerform1.emoji || "",
      uses: role.canPerform1.nbrLeftToPerform,
      time: role.canPerform1.actionTime,
    });
  }
  if (role.canPerform2?.label) {
    abilities.push({
      label: isFr ? role.canPerform2.labelFR || role.canPerform2.label : role.canPerform2.label,
      emoji: role.canPerform2.emoji || "",
      uses: role.canPerform2.nbrLeftToPerform,
      time: role.canPerform2.actionTime,
    });
  }

  const getUsesLabel = (uses) => {
    if (uses == null) return "\u221E";
    if (uses === 1) return "unique";
    return `x${uses}`;
  };

  return (
    <div
      className={`group relative rounded-xl border ${colors.border} ${colors.hoverBorder} bg-slate-900/80 backdrop-blur-sm overflow-hidden transition-all duration-300 cursor-pointer hover:shadow-xl ${colors.glowShadow} hover:-translate-y-0.5 h-full flex flex-col`}
    >
      {/* Background image overlay */}
      {role.image2 && (
        <div
          className="absolute inset-0 bg-cover bg-center opacity-15 group-hover:opacity-25 transition-opacity duration-300 pointer-events-none"
          style={{ backgroundImage: `url(${role.image2})` }}
        />
      )}

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/50 to-slate-900/95 pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 flex flex-col h-full">
        {/* Header: icon on left, name + team on right */}
        <div className="flex items-center gap-3 p-4 pb-3">
          <div className={`w-14 h-14 rounded-xl border-2 ${colors.imageBorder} overflow-hidden bg-black/40 shadow-lg flex-shrink-0`}>
            <NextImage
              alt={role.name}
              height={128}
              width={128}
              src={role.image}
              className="object-cover w-full h-full"
              unoptimized
            />
          </div>
          <div className="flex flex-col min-w-0">
            <h3 className="text-white text-base font-bold leading-tight flex items-center gap-1.5">
              <span className="truncate">{roleName}</span>
              {role.roleEmoji && <span className="text-lg flex-shrink-0">{role.roleEmoji}</span>}
            </h3>
            <div className={`inline-flex items-center self-start gap-1 mt-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${colors.tagBg} ${colors.tagText} ${colors.tagBorder}`}>
              {teamName}
            </div>
          </div>
        </div>

        {/* Description — grows to fill space */}
        <div className="px-4 pb-3 flex-1">
          <p className="text-slate-300 text-xs leading-relaxed">
            {roleDesc}
          </p>
        </div>

        {/* Abilities section — always at bottom */}
        {abilities.length > 0 && (
          <div className={`mx-3 mb-3 rounded-lg ${colors.accentBg} border ${colors.tagBorder} p-2 mt-auto`}>
            {abilities.map((ability, idx) => (
              <div key={idx} className="flex items-center justify-between gap-2 py-1">
                <div className="flex items-center gap-1.5 min-w-0">
                  {ability.emoji && (
                    <NextImage
                      src={ability.emoji}
                      alt={ability.label}
                      width={18}
                      height={18}
                      className="flex-shrink-0 object-contain w-[18px] h-[18px]"
                      unoptimized
                    />
                  )}
                  <span className="text-xs text-slate-200">{ability.label}</span>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  {ability.time && (
                    <span className="text-[10px] text-slate-500 uppercase">
                      {ability.time === "night" ? (isFr ? "nuit" : "night") : (isFr ? "jour" : "day")}
                    </span>
                  )}
                  <span className="text-[10px] font-bold bg-slate-700/60 text-slate-300 px-1.5 py-0.5 rounded">
                    {getUsesLabel(ability.uses)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RoleCard;
