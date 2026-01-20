"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import SelectablePlayerCard from "./SelectablePlayerCard";

/**
 * SelectionScreen - Modal/overlay for target selection
 *
 * Features:
 * - Header with action emoji and name
 * - Grid of large, touch-friendly player cards
 * - Cancel button to return to idle
 * - "Don't want to vote" option for vote phase
 * - Support for selecting two players (Cupid link)
 */
const SelectionScreen = ({
  action,
  onSelect,
  onCancel,
  onSkip,
  isVotePhase = false,
}) => {
  const { t } = useTranslation();
  const [selectedPlayers, setSelectedPlayers] = useState([]);

  const { emoji, label, targets = [], selectTwo } = action;

  const handlePlayerSelect = (player) => {
    if (selectTwo) {
      // Two-player selection (Cupid)
      const isAlreadySelected = selectedPlayers.some(p => p.id === player.id);
      if (isAlreadySelected) {
        // Deselect
        setSelectedPlayers(prev => prev.filter(p => p.id !== player.id));
      } else if (selectedPlayers.length < 2) {
        const newSelection = [...selectedPlayers, player];
        setSelectedPlayers(newSelection);

        // Auto-confirm when 2 selected
        if (newSelection.length === 2) {
          onSelect(newSelection);
        }
      }
    } else {
      // Single selection
      onSelect(player);
    }
  };

  const handleSkipVote = () => {
    if (onSkip) {
      onSkip();
    }
  };

  return (
    <div className="absolute inset-0 z-40 flex flex-col bg-slate-900/95 backdrop-blur-sm animate-fadeIn">
      {/* Header */}
      <div className="flex-shrink-0 flex items-center justify-between px-4 py-3 bg-slate-800 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{emoji}</span>
          <div>
            <h2 className="text-white font-bold text-lg">{label}</h2>
            <p className="text-slate-400 text-sm">
              {selectTwo
                ? t("game.selectTwoPlayers") || "Select 2 players"
                : t("game.selectPlayer") || "Select a player"
              }
            </p>
          </div>
        </div>

        {/* Cancel button */}
        <button
          onClick={onCancel}
          className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
        >
          {t("game.cancel") || "Cancel"}
        </button>
      </div>

      {/* Selection progress for two-player mode */}
      {selectTwo && (
        <div className="flex-shrink-0 px-4 py-2 bg-slate-800/50 border-b border-slate-700">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 text-sm">{t("game.selected") || "Selected"}:</span>
            <div className="flex gap-2">
              {[0, 1].map(index => (
                <div
                  key={index}
                  className={`
                    w-8 h-8 rounded-full flex items-center justify-center
                    ${selectedPlayers[index]
                      ? 'bg-green-600 text-white'
                      : 'bg-slate-700 text-slate-500'
                    }
                  `}
                >
                  {selectedPlayers[index]
                    ? selectedPlayers[index].name.charAt(0).toUpperCase()
                    : index + 1
                  }
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Player grid */}
      <div className="flex-1 overflow-y-auto p-4">
        {targets.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-400">
            <span className="text-4xl mb-2">🚫</span>
            <p>{t("game.noTargets") || "No valid targets"}</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 max-w-4xl mx-auto">
            {targets.map(player => (
              <SelectablePlayerCard
                key={player.id}
                player={player}
                onSelect={handlePlayerSelect}
                actionEmoji={emoji}
                isSelected={selectedPlayers.some(p => p.id === player.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Bottom bar for vote phase */}
      {isVotePhase && (
        <div className="flex-shrink-0 px-4 py-3 bg-slate-800 border-t border-slate-700">
          <button
            onClick={handleSkipVote}
            className="w-full py-3 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-xl font-medium transition-colors"
          >
            🤷 {t("game.dontWantToVote") || "Don't want to vote"}
          </button>
        </div>
      )}

      {/* Confirm button for two-player selection */}
      {selectTwo && selectedPlayers.length === 2 && (
        <div className="flex-shrink-0 px-4 py-3 bg-slate-800 border-t border-slate-700">
          <button
            onClick={() => onSelect(selectedPlayers)}
            className="w-full py-3 bg-green-600 hover:bg-green-500 text-white rounded-xl font-bold transition-colors"
          >
            ✓ {t("game.confirm") || "Confirm"} ({selectedPlayers.map(p => p.name).join(" & ")})
          </button>
        </div>
      )}
    </div>
  );
};

export default SelectionScreen;
