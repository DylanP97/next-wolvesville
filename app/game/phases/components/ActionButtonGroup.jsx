"use client";

import ActionButton from "./ActionButton";

/**
 * ActionButtonGroup - Horizontal group of action buttons
 *
 * Displays all available actions for the current phase with their states.
 * Includes cemetery and revealed players menu buttons.
 */
const ActionButtonGroup = ({
  actions = [],
  activeActionType = null,
  completedActions = new Set(),
  onActionClick,
  onCemeteryClick,
  onRevealedClick,
  deadCount = 0,
}) => {
  // Don't render if no actions available
  if (actions.length === 0) {
    return (
      <div className="flex items-center justify-center gap-3 px-4 py-3">
        {/* Cemetery button always visible if there are dead players */}
        {deadCount > 0 && (
          <MenuButton
            emoji="⚰️"
            label="Cemetery"
            onClick={onCemeteryClick}
            badge={deadCount}
          />
        )}
        {/* Revealed menu always available */}
        <MenuButton
          emoji="📋"
          label="Players"
          onClick={onRevealedClick}
        />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center gap-3 px-4 py-3 bg-slate-800/80 backdrop-blur-sm border-t border-slate-700">
      {/* Main action buttons */}
      <div className="flex items-center gap-2">
        {actions.map((action) => (
          <ActionButton
            key={action.type}
            action={action}
            isActive={activeActionType === action.type}
            isCompleted={completedActions.has(action.type)}
            onClick={onActionClick}
          />
        ))}
      </div>

      {/* Divider */}
      {(deadCount > 0 || true) && (
        <div className="w-px h-12 bg-slate-600" />
      )}

      {/* Menu buttons */}
      <div className="flex items-center gap-2">
        {deadCount > 0 && (
          <MenuButton
            emoji="⚰️"
            label="Cemetery"
            onClick={onCemeteryClick}
            badge={deadCount}
          />
        )}
        <MenuButton
          emoji="📋"
          label="Players"
          onClick={onRevealedClick}
        />
      </div>
    </div>
  );
};

/**
 * MenuButton - Secondary button for cemetery/revealed menus
 */
const MenuButton = ({ emoji, label, onClick, badge }) => {
  return (
    <button
      onClick={onClick}
      className="
        relative flex flex-col items-center justify-center
        min-w-[56px] px-2 py-1.5 rounded-lg
        bg-slate-700/50 hover:bg-slate-600 text-slate-300
        transition-all duration-200
        active:scale-95
      "
    >
      <span className="text-xl">{emoji}</span>
      <span className="text-[10px] font-medium">{label}</span>

      {/* Badge for counts */}
      {badge !== undefined && badge > 0 && (
        <div className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
          {badge}
        </div>
      )}
    </button>
  );
};

export default ActionButtonGroup;
