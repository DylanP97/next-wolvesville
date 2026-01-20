"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useGame } from "../GameProvider";
import { useAuth } from "../../providers/AuthProvider";
import { useTranslation } from "react-i18next";
import i18n from "../../lib/i18n";
import useAvailableActions from "../hooks/useAvailableActions";
import TimerBar from "./components/TimerBar";
import ActionButtonGroup from "./components/ActionButtonGroup";
import SelectionScreen from "./components/SelectionScreen";
import IdleView from "./components/IdleView";
import SpecialOverlay from "./components/SpecialOverlay";
import CemeterySlideout from "./components/CemeterySlideout";
import RevealedPlayersMenu from "./components/RevealedPlayersMenu";
import ChatPanel from "./components/ChatPanel";

/**
 * ActionGameLayout - New action-based game layout
 *
 * Replaces the grid-based layout with:
 * - Action buttons based on role and phase
 * - Selection screen for target selection
 * - Auto-open selection for vote phase
 * - Cemetery and revealed players menus
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
  const [showCemetery, setShowCemetery] = useState(false);
  const [showRevealedMenu, setShowRevealedMenu] = useState(false);
  const [showChat, setShowChat] = useState(false);

  const role = clientPlayer?.role;
  const roleName = role?.name;
  const displayRoleName = i18n.language === "fr" ? role?.nameFR : role?.name;
  const isWolf = role?.team === "Werewolves";
  const isAlive = clientPlayer?.isAlive;
  const isAftermath = timeOfTheDay?.includes("Aftermath");

  // Dead players count
  const deadPlayers = useMemo(() =>
    playersList.filter(p => !p.isAlive),
    [playersList]
  );

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
    setActiveAction(null);
    setCompletedActions(new Set());
    setShowChat(false);

    // Auto-open selection for vote phase
    if (timeOfTheDay === "votetime" && isAlive && !isUnderArrest) {
      const voteAction = availableActions.find(a => a.type === "vote");
      if (voteAction) {
        // Small delay to let the UI settle
        setTimeout(() => {
          setActiveAction(voteAction);
        }, 500);
      }
    }
  }, [timeOfTheDay, isAlive, isUnderArrest, availableActions]);

  // Available chat
  const availableChat = useMemo(() => {
    if (!isAlive && roleName !== "Medium") return null;

    if (timeOfTheDay === "daytime" || timeOfTheDay === "votetime") {
      if (isUnderArrest) return null;
      return { type: "general", label: t("game.chat") || "Chat" };
    }

    if (timeOfTheDay === "nighttime" || timeOfTheDay === "nighttimeAftermath") {
      if (isUnderArrest) return { type: "jail", label: t("game.jailChat") || "Jail", data: jail };
      if (isWolf) return { type: "wolves", label: t("game.wolvesChat") || "Wolves", data: wolves };
      if (roleName === "Jailer" && clientPlayer?.hasHandcuffed) {
        return { type: "jail", label: t("game.jailChat") || "Jail", data: jail };
      }
      if (roleName === "Medium") return { type: "medium", label: t("game.mediumChat") || "Spirits", data: medium };
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

  // Handle action button click
  const handleActionClick = useCallback((action) => {
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
  }, [activeAction]);

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

  // Handle target selection
  const handleSelect = useCallback((playerOrPlayers) => {
    if (!activeAction) return;

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
  }, [activeAction, socket, clientPlayer, roleName, gameId, selectionHelpers]);

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
            {/* Main view area */}
            <div className="flex-1 flex flex-col min-h-0">
              {/* Idle view or chat when no selection */}
              {!showSelectionScreen && (
                <>
                  <div className="flex-1">
                    <IdleView />
                  </div>

                  {/* Chat (shown when not selecting) */}
                  {availableChat && (
                    <div className="flex-shrink-0 h-48 border-t border-slate-700">
                      <ChatPanel chatConfig={availableChat} />
                    </div>
                  )}
                </>
              )}
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

        {/* Cemetery Slideout */}
        {showCemetery && (
          <CemeterySlideout
            deadPlayers={deadPlayers}
            onClose={() => setShowCemetery(false)}
          />
        )}

        {/* Revealed Players Menu */}
        {showRevealedMenu && (
          <RevealedPlayersMenu
            players={playersList}
            onClose={() => setShowRevealedMenu(false)}
          />
        )}
      </div>

      {/* Action Bar */}
      {!specialSituation && !isAftermath && (
        <ActionButtonGroup
          actions={availableActions}
          activeActionType={activeAction?.type}
          completedActions={completedActions}
          onActionClick={handleActionClick}
          onCemeteryClick={() => setShowCemetery(true)}
          onRevealedClick={() => setShowRevealedMenu(true)}
          deadCount={deadPlayers.length}
        />
      )}
    </div>
  );
};

export default ActionGameLayout;
