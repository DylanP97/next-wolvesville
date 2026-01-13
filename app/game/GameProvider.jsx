"use client";

import { createContext, useContext, useEffect, useRef, useState, useMemo } from "react";
import { useAuth } from "../providers/AuthProvider";
import { useSound } from "../providers/SoundProvider";
import { useAnimation } from "../providers/AnimationProvider";
import { useTranslation } from "react-i18next";

const GameContext = createContext();

export const GameProvider = ({ children }) => {
  const { game, socket, username } = useAuth();

  const { generateNoise } = useSound();
  const { triggerAnimation, triggerSimpleMessage } = useAnimation();
  const { t } = useTranslation();

  const weatherColors = {
    daytime: "bg-sky-500",
    votetime: "bg-sky-700",
    votetimeAftermath: "bg-sky-900",
    nighttime: "bg-black",
    nighttimeAftermath: "bg-blue-900",
  };

  const [selectionState, setSelectionState] = useState({
    mode: 'idle', // 'idle' | 'single' | 'double' | 'completed'
    actionType: null,
    actionEmoji: null,
    blockedActions: new Set(), // Track which actions are blocked
    selectedPlayers: [], // Array to hold selected player(s)
  });

  const [showDeathFlash, setShowDeathFlash] = useState(false);

  const gameId = game.id;
  const isPaused = game.isPaused;
  const playersList = game.playersList;
  const aliveList = game.playersList.filter((p) => p.isAlive);
  const clientPlayer = game.playersList.find((p) => p.name == username);

  // Guard clause: Ensure player exists in game
  if (!clientPlayer) {
    console.error("Player not found in game:", username);
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        gap: '1rem'
      }}>
        <h2>You are not in this game</h2>
        <p>Player "{username}" not found in the game.</p>
        <button
          onClick={() => window.location.href = '/'}
          style={{
            padding: '0.5rem 1rem',
            fontSize: '1rem',
            cursor: 'pointer',
            borderRadius: '4px',
            border: 'none',
            backgroundColor: '#e50403',
            color: 'white'
          }}
        >
          Return to Homepage
        </button>
      </div>
    );
  }

  const dayCount = game.dayCount;
  const timeCounter = game.timeCounter;
  const winningTeam = game.winningTeam;
  const jailChat = game.jailNightMessages || [];
  const wolvesChat = game.wolvesMessagesHistory || [];
  const mediumChat = game.mediumMessagesHistory || [];
  const generalChat = game.messagesHistory;

  class Chat {
    constructor(type, label, history, emoji) {
      (this.type = type),
        (this.label = label),
        (this.history = history),
        (this.emoji = emoji);
    }
  }

  const general = new Chat("general", t("game.generalChat"), generalChat, "🏘️");
  const wolves = new Chat("wolves", t("game.wolvesChat"), wolvesChat, "🐺");
  const jail = new Chat("jail", t("game.jailChat"), jailChat, "👮‍♂️");
  const medium = new Chat("medium", t("game.mediumChat"), mediumChat, "🔮");

  const isWolf = clientPlayer.role.team === "Werewolves";
  const isJailer = clientPlayer.role.name === "Jailer";
  const isMedium = clientPlayer.role.name === "Medium";
  const isAlive = clientPlayer.isAlive;
  const isUnderArrest = clientPlayer.isUnderArrest;
  const hasHandcuffed = clientPlayer.hasHandcuffed;

  const timeOfTheDay = game.timeOfTheDay;

  const [weather, setWeather] = useState(weatherColors[timeOfTheDay]);
  const [usedChat, setUsedChat] = useState(general);
  const [availableChats, setAvailableChats] = useState([general]);

  const processedSecondRef = useRef(null);
  const hasPlayedIntroRef = useRef(false)

  // SELECTION HELPERS:
  const selectionHelpers = useMemo(() => ({
    // Start a new selection
    startSelection(actionType, emoji, needsDouble = false) {
      setSelectionState(prev => ({
        ...prev,
        mode: needsDouble ? 'double' : 'single',
        actionType,
        actionEmoji: emoji,
        selectedPlayers: [],
      }));
    },

    // NEW METHOD: Reset to idle but preserve blocked actions
    resetToIdle() {
      setSelectionState(prev => ({
        ...prev,
        mode: 'idle',
        actionType: null,
        actionEmoji: null,
        selectedPlayers: [],
        // Keep blockedActions and completedActions - don't reset them
      }));
    },

    // Add a selected player
    addPlayer(player) {
      setSelectionState(prev => ({
        ...prev,
        selectedPlayers: [...prev.selectedPlayers, player],
      }));
    },

    // Complete the selection - NOW STORES THE SELECTED PLAYERS
    complete(actionType) {
      setSelectionState(prev => ({
        ...prev,
        mode: 'completed',
        blockedActions: new Set([...prev.blockedActions, actionType]),
        completedActions: {
          ...prev.completedActions,
          [actionType]: prev.selectedPlayers.map(p => p.id) // Store player IDs
        },
        // Keep selectedPlayers so they can be displayed
      }));
    },

    // Block specific action type (for Wolf Seer vote case)
    blockAction(actionType) {
      setSelectionState(prev => ({
        ...prev,
        blockedActions: new Set([...prev.blockedActions, actionType]),
      }));
    },

    // Reset on new phase
    reset() {
      setSelectionState({
        mode: 'idle',
        actionType: null,
        actionEmoji: null,
        blockedActions: new Set(),
        selectedPlayers: [],
      });
    },

    // Toggle selection mode
    toggle(actionType, emoji, needsDouble = false) {
      setSelectionState(prev => {
        // If clicking same action, deactivate
        if (prev.actionType === actionType && prev.mode !== 'idle') {
          return {
            ...prev,
            mode: 'idle',
            actionType: null,
            actionEmoji: null,
            selectedPlayers: []
          };
        }
        // Start new selection
        return {
          ...prev,
          mode: needsDouble ? 'double' : 'single',
          actionType,
          actionEmoji: emoji,
          selectedPlayers: [],
        };
      });
    },

    // Check if action is available
    isActionBlocked(actionType) {
      return selectionState.blockedActions.has(actionType);
    },

    // Check if we're in selection mode
    isSelecting() {
      return selectionState.mode === 'single' || selectionState.mode === 'double';
    },

    // Check if action is active
    isActionActive(actionType) {
      return selectionState.actionType === actionType && selectionHelpers.isSelecting();
    },

    // NEW: Check if player was targeted by a specific action
    wasPlayerTargeted(playerId, actionType) {
      const targetedIds = selectionState.completedActions[actionType];
      return targetedIds && targetedIds.includes(playerId);
    },
  }), [selectionState]);


  useEffect(() => {
    selectionHelpers.reset(); // Instead of setting individual states
    setWeather(weatherColors[timeOfTheDay]);
    if (timeOfTheDay === "nighttime" && !winningTeam && !hasPlayedIntroRef.current) {
      hasPlayedIntroRef.current = true; // ← Set flag
      generateNoise("wolfHowl");
      triggerAnimation("moon");
    }
    if (timeOfTheDay === "votetime" && !winningTeam) {
      generateNoise("pianoPercussion");
    }
    if (timeOfTheDay === "daytime" && !winningTeam) {
      generateNoise("rooster");
      triggerAnimation("happySun");
    }

    // Reset available chats state
    if (
      (clientPlayer.isAlive && isUnderArrest) ||
      (clientPlayer.isAlive &&
        isJailer &&
        timeOfTheDay === "nighttime" &&
        hasHandcuffed > 0)
    ) {
      setAvailableChats([general, jail]);
      setUsedChat(jail);
    } else if (timeOfTheDay === "nighttime" && isWolf) {
      setAvailableChats([general, wolves]);
      setUsedChat(wolves);
    } else if (timeOfTheDay === "nighttime" && ((isMedium && isAlive) || !isAlive)) {
      // Medium chat available to: alive Medium OR any dead player
      setAvailableChats([general, medium]);
      setUsedChat(medium);
    } else {
      setAvailableChats([general]);
      setUsedChat(general);
    }
  }, [timeOfTheDay]);

  useEffect(() => {
    if (!isAlive) {
      generateNoise("maleScreamFear");
      triggerSimpleMessage(t("game.youDied"));

      // Trigger death flash effect
      setShowDeathFlash(true);
      setTimeout(() => {
        setShowDeathFlash(false);
      }, 300); // Flash lasts 300ms
    }
  }, [isAlive]);

  useEffect(() => {
    if (timeOfTheDay === "votetime" && timeCounter === 25000) {
      generateNoise("softSuspense");
    }
    if (timeOfTheDay === "votetime" && timeCounter === 4000) {
      generateNoise("riserVotetime");
    }
    if (timeOfTheDay === "nighttime" && timeCounter === 20000) {
      generateNoise("mysteriousArea");
    }
  }, [timeCounter, timeOfTheDay]);


  useEffect(() => {
    if (!winningTeam) {
      socket.emit("checkForWinner", game.id);
    } else {
      !game.hasEnded && socket.emit("endGame", game.id);
    }
  }, [timeCounter]);

  // Safety check: don't initialize if showing role reveal
  if (!game || game.showingRoleReveal) {
    return null;
  }


  return (
    <GameContext.Provider
      value={{
        clientPlayer,
        gameId,
        isPaused,
        timeOfTheDay,
        dayCount,
        timeCounter,
        winningTeam,
        playersList,
        aliveList,
        isWolf,
        isJailer,
        isMedium,
        isUnderArrest,
        hasHandcuffed,
        jailChat,
        wolvesChat,
        mediumChat,
        generalChat,
        jail,
        wolves,
        medium,
        general,
        selectionState,
        setSelectionState,
        selectionHelpers,
        weather,
        usedChat,
        setUsedChat,
        availableChats,
        setAvailableChats,
        showDeathFlash,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);

  if (!context) {
    throw new Error("useGame must be used within an GameProvider");
  }

  return context;
};
