// performVoteAction.js

import { getRandomAlivePlayer } from "./cpuMoveUtils";

export default function performVoteAction(playersList, cpu, socket, gameId) {
    let voteTarget = null;

    // Check if there's a revealed Serial Killer
    const revealedSerialKiller = playersList.find(
        (player) =>
            player.isAlive &&
            !player.isUnderArrest &&
            player.id !== cpu.id &&
            player.isRevealed &&
            player.role.name === "Serial Killer"
    );

    // 80% chance to vote for revealed Serial Killer if one exists
    if (revealedSerialKiller && Math.random() < 0.8) {
        voteTarget = revealedSerialKiller;
    } else {
        // Otherwise vote randomly
        voteTarget = getRandomAlivePlayer(playersList, false, false, cpu.id);
    }

    if (voteTarget) {
        const nbr = cpu.role.name === "Mayor" && cpu.isRevealed ? 3 : 1;
        socket.emit(
            "addVote",
            {
                type: "addVote",
                playerId: cpu.id,
                playerName: cpu.name,
                selectedPlayerId: voteTarget.id,
                selectedPlayerName: voteTarget.name,
                nbr: nbr,
            },
            gameId
        );
    }
}

