"use client";

import ActionButton from "./ActionButton";

/**
 * ActionButtonGroup - Horizontal group of action buttons
 *
 * Displays all available actions for the current phase with their states.
 */
const ActionButtonGroup = ({
  actions = [],
  activeActionType = null,
  completedActions = new Set(),
  onActionClick,
}) => {
  // Don't render if no actions available
  if (actions.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center justify-center gap-3 px-4 py-3 bg-slate-800/80 backdrop-blur-sm border-t border-slate-700">
      {/* Main action buttons */}
      <div className="flex items-center gap-2 flex-wrap justify-center">
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
    </div>
  );
};

export default ActionButtonGroup;
