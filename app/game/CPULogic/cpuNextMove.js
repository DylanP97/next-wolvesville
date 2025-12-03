
import i18n from "../../lib/i18n";
import { getRandomAlivePlayer } from "./cpuMoveUtils";
import performDayAction from "./performDayAction";
import performVoteAction from "./performVoteAction";
import performNightAction from "./performNightAction";

const cpuNextMove = (
  cpu,
  dayCount,
  timeOfTheDay,
  playersList,
  socket,
  gameId
) => {


  if (timeOfTheDay === "nighttime") {
    performNightAction(playersList, cpu, socket, gameId, dayCount);
  } else if (timeOfTheDay === "daytime") {
    performDayAction(playersList, cpu, socket, gameId);
  } else if (timeOfTheDay === "votetime") {
    performVoteAction(playersList, cpu, socket, gameId);
  }
};

export default cpuNextMove;
