import validateSelection from './validateSelection';
import handleSingleSelection from './handleSingleSelection';
import handleDoubleSelection from './handleDoubleSelection';

const handlePlayerClick = (
  player,
  clientPlayer,
  gameId,
  socket,
  timeOfTheDay,
  triggerAnimation,
  setErrorMessage,
  selectionState,     // <-- ADD
  selectionHelpers,
  t
) => {
  const { mode, actionType, selectedPlayers } = selectionState;

  // Guard: Player must be alive to take actions
  if (!clientPlayer.isAlive) {
    setErrorMessage(t("errorMessage.0011"));
    triggerAnimation(t("deadStuck"));
    return;
  }

  if (clientPlayer?.willHaveNightmares && timeOfTheDay === "nighttime") {
    setErrorMessage(t("errorMessage.0014"));
    return;
  }

  // Guard: Must be in selection mode
  if (mode === 'idle' || mode === 'completed') {
    setErrorMessage(t("errorMessage.0009"));
    return;
  }

  // Validation based on action type
  const validation = validateSelection(player, clientPlayer, actionType, timeOfTheDay);
  if (!validation.valid) {
    console.log("Selection invalid:", validation);
    setErrorMessage(t(`${validation.errorCode}`));
    if (validation.animation) triggerAnimation(validation.animation);
    return;
  }

  // Handle selection based on mode
  if (mode === 'single') {
    handleSingleSelection(player, clientPlayer, gameId, socket, actionType, selectionHelpers);
  } else if (mode === 'double') {
    handleDoubleSelection(player, clientPlayer, gameId, socket, actionType, selectedPlayers, selectionHelpers);
  }
};

export default handlePlayerClick;