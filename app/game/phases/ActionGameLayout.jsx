"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useGame } from "../GameProvider";
import { useAuth } from "../../providers/AuthProvider";
import { useTranslation } from "react-i18next";
import i18n from "../../lib/i18n";
import useAvailableActions from "../hooks/useAvailableActions";
import TimerBar from "./components/TimerBar";
import ActionButtonGroup from "./components/ActionButtonGroup";
import SelectionScreen from "./components/SelectionScreen";
import RoleTipsPanel from "./components/RoleTipsPanel";
import SpecialOverlay from "./components/SpecialOverlay";
import ChatPanel from "./components/ChatPanel";
import VoteTracker from "./components/VoteTracker";
import WolfVoteTracker from "./components/WolfVoteTracker";
import PlayersView from "./components/PlayersView";
import VillageView from "./components/VillageView";
import AftermathPanel from "./components/AftermathPanel";

/**
 * ActionGameLayout - New action-based game layout
 *
 * Features:
 * - View tabs: Chat, Players, Village (2D view)
 * - Action buttons based on role and phase
 * - Selection screen for target selection
 * - Aftermath panels for showing events
 * - Wolf vote tracker for werewolves
 */
const ActionGameLayout = () => {
  const { t } = useTranslation();
  const { socket } = useAuth();
  const {
    clientPlayer,
    playersList,
    aliveList,
    gameId,
    timeOfTheDay,
    dayCount,
    isUnderArrest,
    selectionHelpers,
    wolves,
    jail,
    medium,
  } = useGame();

  // Get all available actions
  const availableActions = useAvailableActions();

  // Local state
  const [activeAction, setActiveAction] = useState(null);
  const [completedActions, setCompletedActions] = useState(new Set());
  const [activeView, setActiveView] = useState("chat"); // "chat" | "players" | "village"

  // Ref to track last phase to detect phase changes
  const lastPhaseRef = useRef(null);
  const hasAutoOpenedVoteRef = useRef(false);

  const role = clientPlayer?.role;
  const roleName = role?.name;
  const displayRoleName = i18n.language === "fr" ? role?.nameFR : role?.name;
  const isWolf = role?.team === "Werewolves";
  const isAlive = clientPlayer?.isAlive;
  const isAftermath = timeOfTheDay?.includes("Aftermath");
  const isNight = timeOfTheDay === "nighttime" || timeOfTheDay === "nighttimeAftermath";

  // Check if we're in vote phase (for showing VoteTracker)
  const isVotePhase = timeOfTheDay === "votetime";

  // Phase info for timer bar
  const phaseInfo = useMemo(() => {
    switch (timeOfTheDay) {
      case "daytime":
        return { name: t("game.daytime") || "Day", emoji: "☀️", color: "from-amber-500 to-orange-500" };
      case "votetime":
      case "votetimeAftermath":
        return { name: t("game.votetime") || "Vote", emoji: "🗳️", color: "from-red-500 to-rose-500" };
      case "nighttime":
      case "nighttimeAftermath":
        return { name: t("game.nighttime") || "Night", emoji: "🌙", color: "from-indigo-600 to-purple-600" };
      default:
        return { name: "Game", emoji: "🎮", color: "from-slate-600 to-slate-700" };
    }
  }, [timeOfTheDay, t]);

  // Reset state on phase change
  useEffect(() => {
    // Only reset if phase actually changed
    if (lastPhaseRef.current === timeOfTheDay) {
      return;
    }

    lastPhaseRef.current = timeOfTheDay;
    hasAutoOpenedVoteRef.current = false;

    setActiveAction(null);
    setCompletedActions(new Set());

    // Auto-switch to appropriate view on phase change
    if (isAftermath) {
      // Keep current view during aftermath, the AftermathPanel will show over it
    } else if (isVotePhase) {
      setActiveView("chat"); // VoteTracker shows in chat view
    }
  }, [timeOfTheDay, isAftermath, isVotePhase]);

  // Auto-open vote selection (separate effect to avoid dependency issues)
  useEffect(() => {
    if (
      timeOfTheDay === "votetime" &&
      isAlive &&
      !isUnderArrest &&
      !hasAutoOpenedVoteRef.current &&
      !completedActions.has("vote")
    ) {
      hasAutoOpenedVoteRef.current = true;
      // Small delay to let the UI settle
      const timer = setTimeout(() => {
        setActiveAction({
          type: "vote",
          emoji: "🗳️",
          label: t("game.vote") || "Vote",
          targets: aliveList.filter(p => p.id !== clientPlayer?.id),
          priority: 1,
          autoOpen: true,
        });
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [timeOfTheDay, isAlive, isUnderArrest, completedActions, aliveList, clientPlayer?.id, t]);

  // Available chat config
  const availableChat = useMemo(() => {
    // Dead players: Medium gets medium chat, others get read-only general chat
    if (!isAlive) {
      if (roleName === "Medium") {
        return { type: "medium", label: t("game.mediumChat") || "Spirits", data: medium };
      }
      return { type: "general", label: t("game.chat") || "Chat", readOnly: true };
    }

    if (timeOfTheDay === "daytime" || timeOfTheDay === "votetime") {
      if (isUnderArrest) return null;
      return { type: "general", label: t("game.chat") || "Chat" };
    }

    if (timeOfTheDay === "nighttime" || timeOfTheDay === "nighttimeAftermath") {
      // Priority: jail > wolves > medium > general (read-only)
      if (isUnderArrest) return { type: "jail", label: t("game.jailChat") || "Jail", data: jail };
      if (isWolf) return { type: "wolves", label: t("game.wolvesChat") || "Wolves", data: wolves };
      if (roleName === "Jailer" && clientPlayer?.hasHandcuffed) {
        return { type: "jail", label: t("game.jailChat") || "Jail", data: jail };
      }
      if (roleName === "Medium") return { type: "medium", label: t("game.mediumChat") || "Spirits", data: medium };
      // Regular villagers can see general chat at night (read-only)
      return { type: "general", label: t("game.chat") || "Chat", readOnly: true };
    }

    return null;
  }, [timeOfTheDay, isAlive, isUnderArrest, isWolf, roleName, clientPlayer, wolves, jail, medium, t]);

  // Special situations (nightmare, jail, dead)
  const specialSituation = useMemo(() => {
    if (clientPlayer?.willHaveNightmares && (timeOfTheDay === "nighttime" || timeOfTheDay === "nighttimeAftermath")) {
      return "nightmare";
    }
    if (isUnderArrest && (timeOfTheDay === "nighttime" || timeOfTheDay === "nighttimeAftermath")) {
      return "jail";
    }
    if (!isAlive && roleName !== "Medium") {
      return "dead";
    }
    return null;
  }, [clientPlayer, isUnderArrest, isAlive, roleName, timeOfTheDay]);

  // Handle no-selection actions (Captain assert duty, Arsonist burn)
  const handleNoSelectionAction = useCallback((action) => {
    if (action.type === "assertDuty") {
      socket.emit("assertDuty", { captainName: clientPlayer.name }, gameId);
    }
    if (action.type === "burn") {
      socket.emit("burnThemDown", { type: "burn", pyroId: clientPlayer.id }, gameId);
    }
    setCompletedActions(prev => new Set([...prev, action.type]));
    selectionHelpers.complete(action.type);
  }, [socket, clientPlayer, gameId, selectionHelpers]);

  // Handle action button click
  const handleActionClick = useCallback((action) => {
    // Block if already completed
    if (completedActions.has(action.type)) {
      return;
    }

    if (action.noSelection) {
      // No selection needed - execute immediately
      handleNoSelectionAction(action);
    } else {
      // Toggle selection screen
      if (activeAction?.type === action.type) {
        setActiveAction(null);
      } else {
        setActiveAction(action);
      }
    }
  }, [activeAction, handleNoSelectionAction, completedActions]);

  // Handle target selection
  const handleSelect = useCallback((playerOrPlayers) => {
    if (!activeAction) return;

    // Block if already completed
    if (completedActions.has(activeAction.type)) {
      setActiveAction(null);
      return;
    }

    const action = activeAction;
    const isArray = Array.isArray(playerOrPlayers);
    const player = isArray ? playerOrPlayers[0] : playerOrPlayers;
    const players = isArray ? playerOrPlayers : [player];

    const payload = {
      type: action.type,
      playerId: clientPlayer.id,
      selectedPlayerId: player.id,
      selectedPlayerName: player.name,
    };

    // Emit appropriate socket event
    switch (action.type) {
      case "vote":
        socket.emit("addVote", {
          playerName: clientPlayer.name,
          ...payload,
          nbr: roleName === "Captain" && clientPlayer.hasAssertedDuty ? 3 : 1,
        }, gameId);
        break;
      case "wolfVote":
        socket.emit("addWolfVote", {
          playerName: clientPlayer.name,
          ...payload,
          nbr: roleName === "Alpha Werewolf" ? 2 : 1,
        }, gameId);
        break;
      case "shoot":
        socket.emit("shootBullet", { ...payload, gunnerId: clientPlayer.id }, gameId);
        break;
      case "reveal":
        socket.emit("revealPlayer", { ...payload, seerId: clientPlayer.id, selectedPlayerRole: player.role?.name }, gameId);
        break;
      case "arrest":
        socket.emit("arrestPlayer", { ...payload, jailerId: clientPlayer.id }, gameId);
        break;
      case "heal":
        socket.emit("heal", payload, gameId);
        break;
      case "protectPotion":
      case "poisonPotion":
        socket.emit(action.type, payload, gameId);
        break;
      case "revive":
        socket.emit("revive", payload, gameId);
        break;
      case "loot":
        socket.emit("lootGrave", { ...payload, graveRobberId: clientPlayer.id, selectedPlayerRole: player.role }, gameId);
        break;
      case "execute":
        socket.emit("executePrisoner", { ...payload, killerId: clientPlayer.id }, gameId);
        break;
      case "murder":
        socket.emit("registerAction", { ...payload, type: "murder", killerId: clientPlayer.id }, gameId);
        break;
      case "pour":
        socket.emit("pourGasoline", { ...payload, pyroId: clientPlayer.id }, gameId);
        break;
      case "ghostVisit":
        socket.emit("ghostVisit", { ghostLadyId: clientPlayer.id, ...payload }, gameId);
        break;
      case "uncoverRole":
        socket.emit("uncoverRole", { wolfSeerId: clientPlayer.id, ...payload }, gameId);
        break;
      case "chooseRevenge":
        socket.emit("chooseJuniorWolfDeathRevenge", { babyWolfId: clientPlayer.id, ...payload }, gameId);
        break;
      case "link":
        // Cupid linking two players
        socket.emit("linkLovers", {
          cupidId: clientPlayer.id,
          player1Id: players[0].id,
          player2Id: players[1].id,
        }, gameId);
        break;
      default:
        socket.emit("registerAction", payload, gameId);
    }

    // Mark action as complete
    setCompletedActions(prev => new Set([...prev, action.type]));
    selectionHelpers.startSelection(action.type, action.emoji);
    players.forEach(p => selectionHelpers.addPlayer(p));
    selectionHelpers.complete(action.type);
    setActiveAction(null);
  }, [activeAction, socket, clientPlayer, roleName, gameId, selectionHelpers, completedActions]);

  // Handle skip vote
  const handleSkipVote = useCallback(() => {
    setCompletedActions(prev => new Set([...prev, "vote"]));
    selectionHelpers.complete("vote");
    setActiveAction(null);
  }, [selectionHelpers]);

  // Handle cancel selection
  const handleCancelSelection = useCallback(() => {
    setActiveAction(null);
  }, []);

  // Check if selection screen should show
  const showSelectionScreen = activeAction && !activeAction.noSelection;

  // Render main content based on active view
  const renderMainContent = () => {
    // During aftermath, show the AftermathPanel
    if (isAftermath) {
      return <AftermathPanel />;
    }

    // During vote phase, show VoteTracker (unless in selection mode)
    if (isVotePhase && !showSelectionScreen) {
      return <VoteTracker />;
    }

    // Night time for wolves: show WolfVoteTracker in a split with chat
    if (isNight && isWolf && !showSelectionScreen && activeView === "chat") {
      return (
        <div className="flex flex-col md:flex-row h-full">
          {/* Wolf Vote Tracker */}
          <div className="flex-shrink-0 md:w-1/3 md:min-w-[200px] md:max-w-[280px] h-[40%] md:h-full border-b md:border-b-0 md:border-r border-slate-700">
            <WolfVoteTracker />
          </div>
          {/* Chat */}
          <div className="flex-1 min-h-0">
            {availableChat ? (
              <ChatPanel chatConfig={availableChat} />
            ) : (
              <div className="flex-1 flex items-center justify-center bg-slate-900/50">
                <p className="text-slate-500 text-sm">{t("game.noChatAvailable") || "No chat available"}</p>
              </div>
            )}
          </div>
        </div>
      );
    }

    // Normal view rendering based on active tab
    switch (activeView) {
      case "players":
        return <PlayersView />;
      case "village":
        return <VillageView />;
      case "chat":
      default:
        // Show tips + chat on non-vote phases
        return (
          <div className="flex flex-col md:flex-row h-full">
            {/* Role Tips Panel */}
            <div className="flex-shrink-0 md:w-1/3 md:min-w-[200px] md:max-w-[280px] h-[30%] md:h-full overflow-hidden border-b md:border-b-0 md:border-r border-slate-700">
              <RoleTipsPanel />
            </div>
            {/* Chat */}
            <div className="flex-1 min-h-0">
              {availableChat ? (
                <ChatPanel chatConfig={availableChat} />
              ) : (
                <div className="flex-1 flex items-center justify-center bg-slate-900/50">
                  <p className="text-slate-500 text-sm">{t("game.noChatAvailable") || "No chat available"}</p>
                </div>
              )}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900">
      {/* Timer Bar */}
      <TimerBar
        phase={phaseInfo}
        dayCount={dayCount}
        roleName={displayRoleName}
        roleImage={role?.image}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden relative">
        {/* Special Overlay (nightmare, jail, dead) */}
        {specialSituation ? (
          <SpecialOverlay
            type={specialSituation}
            chat={specialSituation === "jail" ? availableChat : null}
          />
        ) : (
          <>
            {/* View Tabs */}
            {!showSelectionScreen && !isAftermath && (
              <div className="flex-shrink-0 flex bg-slate-800 border-b border-slate-700">
                <ViewTab
                  active={activeView === "chat"}
                  onClick={() => setActiveView("chat")}
                  emoji="💬"
                  label={t("game.chat") || "Chat"}
                />
                <ViewTab
                  active={activeView === "players"}
                  onClick={() => setActiveView("players")}
                  emoji="👥"
                  label={t("game.players") || "Players"}
                />
                <ViewTab
                  active={activeView === "village"}
                  onClick={() => setActiveView("village")}
                  emoji="🏘️"
                  label={t("game.village") || "Village"}
                />
              </div>
            )}

            {/* Main content area */}
            <div className="flex-1 min-h-0 overflow-hidden">
              {!showSelectionScreen && renderMainContent()}
            </div>

            {/* Selection Screen overlay */}
            {showSelectionScreen && (
              <SelectionScreen
                action={activeAction}
                onSelect={handleSelect}
                onCancel={handleCancelSelection}
                onSkip={activeAction.type === "vote" ? handleSkipVote : null}
                isVotePhase={activeAction.type === "vote"}
              />
            )}
          </>
        )}
      </div>

      {/* Action Bar */}
      {!specialSituation && !isAftermath && (
        <ActionButtonGroup
          actions={availableActions}
          activeActionType={activeAction?.type}
          completedActions={completedActions}
          onActionClick={handleActionClick}
        />
      )}
    </div>
  );
};

/**
 * ViewTab - Tab button for switching views
 */
const ViewTab = ({ active, onClick, emoji, label }) => (
  <button
    onClick={onClick}
    className={`flex-1 py-2 px-3 text-sm font-medium transition-colors flex items-center justify-center gap-1.5 ${
      active
        ? "text-white bg-slate-700 border-b-2 border-blue-500"
        : "text-slate-400 hover:text-white hover:bg-slate-700/50"
    }`}
  >
    <span>{emoji}</span>
    <span className="hidden sm:inline">{label}</span>
  </button>
);

export default ActionGameLayout;
