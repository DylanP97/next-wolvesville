"use client";

import { useTranslation } from "react-i18next";
import ChatPanel from "./ChatPanel";

/**
 * SpecialOverlay - Overlays for special situations (nightmare, jail, dead)
 */
const SpecialOverlay = ({ type, chat }) => {
  const { t } = useTranslation();

  switch (type) {
    case "nightmare":
      return <NightmareOverlay />;
    case "jail":
      return <JailOverlay chat={chat} />;
    case "dead":
      return <DeadOverlay />;
    default:
      return null;
  }
};

/**
 * NightmareOverlay - Player is having nightmares (can't act)
 */
const NightmareOverlay = () => {
  const { t } = useTranslation();

  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-gradient-to-b from-purple-900 to-slate-900 p-8">
      <div className="text-8xl mb-6 animate-pulse">😱</div>
      <h2 className="text-white text-2xl font-bold mb-3">
        {t("game.nightmare") || "Nightmare!"}
      </h2>
      <p className="text-purple-300 text-center max-w-sm">
        {t("game.nightmareDescription") || "The Nightmare Werewolf has invaded your dreams. You cannot use your ability tonight."}
      </p>
      <div className="mt-8 flex gap-2">
        <span className="text-4xl animate-bounce" style={{ animationDelay: "0s" }}>👻</span>
        <span className="text-4xl animate-bounce" style={{ animationDelay: "0.2s" }}>🐺</span>
        <span className="text-4xl animate-bounce" style={{ animationDelay: "0.4s" }}>💀</span>
      </div>
    </div>
  );
};

/**
 * JailOverlay - Player is under arrest
 */
const JailOverlay = ({ chat }) => {
  const { t } = useTranslation();

  return (
    <div className="flex-1 flex flex-col bg-gradient-to-b from-orange-900 to-slate-900">
      {/* Jail header */}
      <div className="flex-shrink-0 flex flex-col items-center justify-center p-6">
        <div className="text-6xl mb-4">👮</div>
        <h2 className="text-white text-xl font-bold">
          {t("game.inJail") || "You are in Jail!"}
        </h2>
        <p className="text-orange-300 text-sm text-center mt-2">
          {t("game.jailDescription") || "The Jailer has arrested you. Convince them you're innocent!"}
        </p>
      </div>

      {/* Jail bars decoration */}
      <div className="flex justify-center gap-4 py-2">
        {[...Array(7)].map((_, i) => (
          <div key={i} className="w-2 h-16 bg-slate-600 rounded-full" />
        ))}
      </div>

      {/* Chat with Jailer */}
      {chat && (
        <div className="flex-1 min-h-0">
          <ChatPanel chatConfig={chat} />
        </div>
      )}
    </div>
  );
};

/**
 * DeadOverlay - Player is dead
 */
const DeadOverlay = () => {
  const { t } = useTranslation();

  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-gradient-to-b from-slate-800 to-slate-900 p-8">
      <div className="text-8xl mb-6 opacity-50">💀</div>
      <h2 className="text-white text-2xl font-bold mb-3 opacity-70">
        {t("game.youAreDead") || "You are Dead"}
      </h2>
      <p className="text-slate-400 text-center max-w-sm">
        {t("game.deadDescription") || "Your journey has ended. Watch the remaining players fight for victory."}
      </p>
      <div className="mt-8 flex items-center gap-3 text-slate-500">
        <span>⚰️</span>
        <span className="text-sm">{t("game.spectating") || "Spectating..."}</span>
        <span>👀</span>
      </div>
    </div>
  );
};

export default SpecialOverlay;
