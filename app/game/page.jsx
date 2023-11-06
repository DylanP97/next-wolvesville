import GameArea from "../components/Game/GameArea";
import { assignRolesToPlayers } from "../lib/gameActions";

const GamePage = async () => {
  const randomRoles = await assignRolesToPlayers();

  return <GameArea randomRoles={randomRoles} />;
};

export default GamePage;
