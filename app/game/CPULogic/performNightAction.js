

import { getPlayerWithId, getRandomDeadPlayer, getNbrOfPlayersMarkedWithGasoline, getRandomAlivePlayer } from "./cpuMoveUtils";
import { performWolfNightVote } from "./performWolfNightVote";

export default function performNightAction(playersList, cpu, socket, gameId, dayCount) {
    // Check if CPU has nightmares - they can't use their ability
    if (cpu.willHaveNightmares) {
        // console.log(cpu.name, "can't do action because of nightmare")
        return; // Action blocked
    }

    switch (cpu.role.name) {
        case "Classic Werewolf":
        case "Alpha Werewolf":
        case "Nightmare Werewolf":
            performWolfNightVote(playersList, cpu, socket, gameId);
            break;
        case "Junior Werewolf":
            let juniorWolftarget = getRandomAlivePlayer(playersList, true, false, cpu.id);
            if (juniorWolftarget) {
                socket.emit(
                    "chooseJuniorWolfDeathRevenge",
                    {
                        juniorWolfId: cpu.id,
                        selectedPlayerId: juniorWolftarget.id,
                    },
                    gameId
                );
            }
            performWolfNightVote(playersList, cpu, socket, gameId);
            break;
        case "Wolf Seer":
            if (cpu.role.canPerform1.nbrLeftToPerform > 0 && Math.random() < 0.8) {
                let playerToUncover = playersList.find(
                    (player) =>
                        player.isAlive &&
                        !player.isUnderArrest &&
                        player.id !== cpu.id &&
                        !player.isRevealedByWolfSeer
                );

                if (playerToUncover) {
                    socket.emit(
                        "uncoverRole",
                        {
                            type: "uncoverRole",
                            wolfSeerId: cpu.id,
                            selectedPlayerId: playerToUncover.id,
                            selectedPlayerName: playerToUncover.name,
                        },
                        gameId
                    );
                }
            }
            performWolfNightVote(playersList, cpu, socket, gameId);
            break;
        case "Witch":
            let witchTarget = getRandomAlivePlayer(playersList, false, false, cpu.id);
            if (witchTarget) {
                if (Math.random() < 0.4) {
                    if (Math.random() < 0.5) {
                        if (cpu.role.canPerform1.nbrLeftToPerform > 0) {
                            socket.emit(
                                "protectPotion",
                                {
                                    type: cpu.role.canPerform1.type,
                                    playerId: cpu.id,
                                    selectedPlayerId: witchTarget.id,
                                    selectedPlayerName: witchTarget.name,
                                },
                                gameId
                            );
                        } else {
                            console.log("no protectPotion remaining for witch");
                        }
                    } else {
                        if (cpu.role.canPerform2.nbrLeftToPerform > 0) {
                            socket.emit(
                                "poisonPotion",
                                {
                                    type: cpu.role.canPerform2.type,
                                    playerId: cpu.id,
                                    selectedPlayerId: witchTarget.id,
                                    selectedPlayerName: witchTarget.name,
                                },
                                gameId
                            );
                        } else {
                            console.log("no poisonPotion remaining for witch");
                        }
                    }
                }
            }
            break;
        case "Serial Killer":
            let victim = getRandomAlivePlayer(playersList, false, false, cpu.id);
            if (victim) {
                socket.emit(
                    "registerAction",
                    {
                        type: "murder",
                        killerId: cpu.id,
                        selectedPlayerId: victim.id,
                        selectedPlayerName: victim.name,
                    },
                    gameId
                );
            }
            break;
        case "Cupid":
            if (dayCount === 0) {
                let lover1 = getRandomAlivePlayer(playersList, false, false, cpu.id);
                let lover2 = getRandomAlivePlayer(playersList, false, false, cpu.id);
                if (lover1 && lover2 && lover1.id !== lover2.id) {
                    socket.emit(
                        "registerAction",
                        {
                            type: "link",
                            lover1Id: lover1.id,
                            lover2Id: lover2.id,
                            cupidId: cpu.id,
                        },
                        gameId
                    );
                }
            }
            break;
        case "Doctor":
            let playerToHeal = getRandomAlivePlayer(playersList, false, false, cpu.id);
            if (playerToHeal) {
                if (Math.random() < 0.8) {
                    socket.emit(
                        "heal",
                        {
                            type: "heal",
                            playerId: cpu.id,
                            selectedPlayerId: playerToHeal.id,
                            selectedPlayerName: playerToHeal.name,
                        },
                        gameId
                    );
                }
            }
            break;
        case "Jailer":
            if (dayCount !== 0 && cpu.hasHandcuffed) {
                let handcuffedPlayerId = cpu.hasHandcuffed;
                let handcuffedPlayer = getPlayerWithId(playersList, handcuffedPlayerId);
                if (handcuffedPlayer) {
                    if (cpu.role.canPerform2.nbrLeftToPerform > 0) {
                        if (Math.random() < 0.3) {
                            socket.emit(
                                "executePrisoner",
                                {
                                    type: "execute",
                                    playerId: cpu.id,
                                    selectedPlayerId: handcuffedPlayerId,
                                    selectedPlayerName: handcuffedPlayer.name,
                                },
                                gameId
                            );
                        }
                    }
                }
            }
            break;
        case "Grave Robber":
            if (Math.random() < 0.3) {
                let deadPlayer = getRandomDeadPlayer(playersList);
                if (deadPlayer) {
                    socket.emit("lootGrave", {
                        type: "loot",
                        graveRobberId: cpu.id,
                        selectedPlayerId: deadPlayer.id,
                        selectedPlayerName: deadPlayer.name,
                        selectedPlayerRole: deadPlayer.role, // Send the dead player's role
                    }, gameId);
                }
            }
            break;
        case "Arsonist":
            if (getNbrOfPlayersMarkedWithGasoline(playersList) >= 2 && Math.random() < 0.3) {
                socket.emit("burnThemDown", {
                    type: "burn",
                    pyroId: cpu.id,
                }, gameId);
            } else {
                let playerToPour = getRandomAlivePlayer(playersList, false, false, cpu.id);
                if (playerToPour) {
                    socket.emit("pourGasoline", {
                        type: "pour",
                        pyroId: cpu.id,
                        selectedPlayerId: playerToPour.id,
                        selectedPlayerName: playerToPour.name,
                    }, gameId);
                }
            }
            break;


        // Add more roles as needed
        default:
            break;
    }
}