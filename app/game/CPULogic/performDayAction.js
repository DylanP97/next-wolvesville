

import { getRandomAlivePlayer } from "./cpuMoveUtils";
import i18n from "../../lib/i18n";

export default function performDayAction(playersList, cpu, socket, gameId) {
    switch (cpu.role.name) {
        case "Mayor":
            if (Math.random() < 0.3 && cpu.role.canPerform1.nbrLeftToPerform > 0) {
                socket.emit("assertDuty", cpu.name, gameId);
            }
            break;
        case "Jailer":
            let arrestedPlayer = getRandomAlivePlayer(playersList, false, false, cpu.id);
            if (arrestedPlayer) {
                socket.emit(
                    "registerAction",
                    {
                        type: "arrest",
                        playerId: cpu.id,
                        selectedPlayerId: arrestedPlayer.id,
                        selectedPlayerName: arrestedPlayer.name,
                    },
                    gameId
                );
            }
            break;
        case "Seer":
            let playerToReveal = getRandomAlivePlayer(playersList, false, true, cpu.id);
            if (playerToReveal) {
                socket.emit(
                    "revealPlayer",
                    {
                        type: "reveal",
                        seerId: cpu.id,
                        selectedPlayerId: playerToReveal.id,
                        selectedPlayerName: playerToReveal.name,
                        selectedPlayerRole: i18n.language === "fr" ? playerToReveal.role.nameFR : playerToReveal.role.name,
                    },
                    gameId
                );
            }
            break;
        case "Nightmare Werewolf":
            if (cpu.role.canPerform1.nbrLeftToPerform > 0 && Math.random() < 0.5) {
                let nightmareTarget = getRandomAlivePlayer(playersList, true, false, cpu.id);
                if (nightmareTarget) {
                    socket.emit(
                        "putNightmare",
                        {
                            type: "putNightmare",
                            playerId: cpu.id,
                            playerName: cpu.name,
                            selectedPlayerId: nightmareTarget.id,
                            selectedPlayerName: nightmareTarget.name,
                        },
                        gameId
                    );
                }
            }
            break;
        case "Gunner":
            if (cpu.role.canPerform1.nbrLeftToPerform > 0 && Math.random() < 0.7) {
                let targetToShoot = getRandomAlivePlayer(playersList, false, false, cpu.id);
                if (targetToShoot) {
                    socket.emit(
                        "shootBullet",
                        {
                            type: "shoot",
                            gunnerId: cpu.id,
                            selectedPlayerId: targetToShoot.id,
                            selectedPlayerName: targetToShoot.name,
                        },
                        gameId
                    );
                }
            }
            break;
        // Add more roles as needed
        default:
            break;
    }
}

