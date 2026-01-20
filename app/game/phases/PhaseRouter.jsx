"use client";

import GameLayout from "./GameLayout";

/**
 * PhaseRouter - Now uses unified GameLayout for all phases
 * The GameLayout handles role-specific views internally
 */
const PhaseRouter = () => {
  return <GameLayout />;
};

export default PhaseRouter;

/* OLD PHASE-BASED ROUTING - kept for reference
import { useGame } from "../GameProvider";
import DayPhaseView from "./DayPhaseView";
import VotePhaseView from "./VotePhaseView";
import NightPhaseView from "./NightPhaseView";

const OldPhaseRouter = () => {
  const { timeOfTheDay } = useGame();

  const renderPhaseView = () => {
    switch (timeOfTheDay) {
      case "daytime":
        return <DayPhaseView />;
      case "votetime":
      case "votetimeAftermath":
        return <VotePhaseView />;
      case "nighttime":
      case "nighttimeAftermath":
        return <NightPhaseView />;
      default:
        return <DayPhaseView />;
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-slate-900">
      {renderPhaseView()}
    </div>
  );
};
*/
