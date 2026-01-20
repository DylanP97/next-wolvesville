"use client";

/**
 * ActionButton - Individual action button with multiple states
 *
 * States:
 * - default: Blue with pulse animation (action available)
 * - active: Green (selection screen is open for this action)
 * - completed: Gray with checkmark (action done this phase)
 * - disabled: Dimmed (cannot use yet or no targets)
 */
const ActionButton = ({
  action,
  isActive = false,
  isCompleted = false,
  isDisabled = false,
  onClick,
}) => {
  const { emoji, label, usesRemaining, targets, noSelection } = action;
  const hasTargets = noSelection || (targets && targets.length > 0);

  // Determine button state and styling
  const getButtonStyles = () => {
    if (isCompleted) {
      return "bg-slate-700 text-slate-400 cursor-default";
    }
    if (isActive) {
      return "bg-green-600 text-white ring-2 ring-green-400 ring-offset-2 ring-offset-slate-900";
    }
    if (isDisabled || !hasTargets) {
      return "bg-slate-700/50 text-slate-500 cursor-not-allowed";
    }
    // Default - available
    return "bg-blue-600 hover:bg-blue-500 text-white active:scale-95 animate-pulse-subtle";
  };

  const handleClick = () => {
    if (!isCompleted && !isDisabled && hasTargets && onClick) {
      onClick(action);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={isCompleted || isDisabled || !hasTargets}
      className={`
        relative flex flex-col items-center justify-center
        min-w-[72px] px-3 py-2 rounded-xl
        transition-all duration-200 ease-out
        ${getButtonStyles()}
      `}
    >
      {/* Main emoji */}
      <span className="text-2xl mb-0.5">
        {isCompleted ? "✅" : emoji}
      </span>

      {/* Label */}
      <span className="text-xs font-medium whitespace-nowrap">
        {label}
      </span>

      {/* Uses remaining badge */}
      {usesRemaining !== undefined && usesRemaining > 0 && !isCompleted && (
        <div className="absolute -top-1 -right-1 bg-amber-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
          {usesRemaining}
        </div>
      )}

      {/* No targets indicator */}
      {!noSelection && (!targets || targets.length === 0) && !isCompleted && (
        <div className="absolute -bottom-1 right-0 text-[10px] text-slate-500">
          ∅
        </div>
      )}
    </button>
  );
};

export default ActionButton;
