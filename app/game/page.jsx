import GameArea from "../components/Game/GameArea";
import { assignRolesToPlayers } from "../lib/gameActions";

const GamePage = async () => {
  const excludedRoles = ["Accomplice"];
  const randomRoles = await assignRolesToPlayers(excludedRoles);

  return <GameArea randomRoles={randomRoles} />;
};

export default GamePage;
