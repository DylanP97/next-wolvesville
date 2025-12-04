

// performVoteAction.js

import { getRandomAlivePlayer } from "./cpuMoveUtils";

export default function performVoteAction(playersList, cpu, socket, gameId) {
    // ========== KNOWLEDGE EXTRACTION ==========
    const cpuRole = cpu.role.name;
    const cpuTeam = cpu.role.team;
    const cpuId = cpu.id;

    // Get all alive, votable players (excluding self and arrested)
    const votablePlayers = playersList.filter(
        p => p.isAlive && p.id !== cpuId
    );

    if (votablePlayers.length === 0) return; // No one to vote for

    // Publicly revealed players (everyone knows their role)
    const revealedPlayers = votablePlayers.filter(p => p.isRevealed);

    // Teammates - only wolves know each other, villagers don't unless revealed
    const teammates = getTeammates(playersList, cpu);

    // Current voting state (who has votes and how many)
    const votingState = getVotingState(votablePlayers);

    // ========== VOTING DECISION CASCADE ==========
    let voteTarget = null;

    // PRIORITY 1: Revealed universal threats (90% certainty)
    // Everyone should vote for these - it's not suspicious
    const revealedSerialKiller = revealedPlayers.find(p => p.role.name === "Serial Killer");
    if (revealedSerialKiller && Math.random() < 0.9) {
        voteTarget = revealedSerialKiller;
        emitVote(socket, cpu, voteTarget, gameId);
        return;
    }

    const revealedPyromaniac = revealedPlayers.find(p => p.role.name === "Pyromaniac");
    if (revealedPyromaniac && Math.random() < 0.9) {
        voteTarget = revealedPyromaniac;
        emitVote(socket, cpu, voteTarget, gameId);
        return;
    }

    // PRIORITY 2: Revealed werewolves (but wolves won't vote for teammates)
    const revealedWolves = revealedPlayers.filter(p =>
        p.role.team === "Werewolves" && !isTeammate(p, teammates)
    );
    if (revealedWolves.length > 0 && Math.random() < 0.85) {
        voteTarget = revealedWolves[Math.floor(Math.random() * revealedWolves.length)];
        emitVote(socket, cpu, voteTarget, gameId);
        return;
    }

    // PRIORITY 3: Strong bandwagon (someone has 3+ votes already)
    // High chance to follow the crowd if it's not a teammate
    if (votingState.leadingPlayer && votingState.leadingVotes >= 3) {
        const leadingIsTeammate = isTeammate(votingState.leadingPlayer, teammates);

        if (!leadingIsTeammate) {
            // Bandwagon probability varies by team
            let bandwagonChance = 0.5; // Base chance (reduced from 0.6)

            if (cpuTeam === "Werewolves") {
                // Wolves bandwagon more to blend in and push eliminations
                bandwagonChance = 0.7;
                // Unless the target is a revealed villager (suspicious)
                if (votingState.leadingPlayer.isRevealed &&
                    votingState.leadingPlayer.role.team === "Village") {
                    bandwagonChance = 0.2; // Very low - too obvious
                }
            } else if (cpuTeam === "Village") {
                // Villagers are more cautious about bandwagoning
                // Only bandwagon if there's a good reason
                if (votingState.leadingPlayer.isRevealed) {
                    // Revealed enemy - safe to bandwagon
                    if (votingState.leadingPlayer.role.team === "Werewolves" ||
                        votingState.leadingPlayer.role.name === "Serial Killer" ||
                        votingState.leadingPlayer.role.name === "Pyromaniac") {
                        bandwagonChance = 0.75; // High - good target
                    } else {
                        // Revealed villager being voted - very suspicious
                        bandwagonChance = 0.1; // Almost never follow
                    }
                } else {
                    // Unknown target - villagers are cautious
                    bandwagonChance = 0.4; // Lower chance
                }
            } else if (cpuRole === "Fool") {
                // Fool avoids bandwagoning (wants to be suspicious)
                bandwagonChance = 0.2;
            } else {
                // Solo roles (Serial Killer, Pyromaniac) bandwagon to blend in
                bandwagonChance = 0.6;
            }

            if (Math.random() < bandwagonChance) {
                voteTarget = votingState.leadingPlayer;
                emitVote(socket, cpu, voteTarget, gameId);
                return;
            }
        } else if (leadingIsTeammate && cpuTeam === "Werewolves") {
            // Teammate is being bandwagoned - wolves try to divert
            // Vote for someone else with votes to split the vote
            const alternativeTargets = votingState.playersWithVotes.filter(p =>
                p.id !== votingState.leadingPlayer.id &&
                !isTeammate(p, teammates)
            );
            if (alternativeTargets.length > 0 && Math.random() < 0.6) {
                voteTarget = alternativeTargets[0]; // Vote for second most voted
                emitVote(socket, cpu, voteTarget, gameId);
                return;
            }
        }
    }


    // PRIORITY 4: Revealed enemies (now we can act on it)
    const revealedVillagers = revealedPlayers.filter(p => p.role.team === "Village");
    if (cpuTeam === "Werewolves" && revealedVillagers.length > 0) {
        // Only vote for revealed villagers in specific scenarios
        const powerfulVillagers = revealedVillagers.filter(p =>
            ["Seer", "Gunner", "Jailer", "Doctor", "Mayor"].includes(p.role.name)
        );

        const aliveWolves = teammates.length + 1; // +1 for self
        const totalAlive = playersList.filter(p => p.isAlive).length;

        // Only if wolves are strong (40%+ of alive players) and target is powerful
        if (powerfulVillagers.length > 0 &&
            aliveWolves / totalAlive >= 0.4 &&
            Math.random() < 0.25) {
            voteTarget = powerfulVillagers[Math.floor(Math.random() * powerfulVillagers.length)];
            emitVote(socket, cpu, voteTarget, gameId);
            return;
        }
    }

    // PRIORITY 5: Revealed villagers (only wolves might vote, very risky)
    // Revealed enemies of CPU's team (but not at Priority 2 already)
    const otherRevealedEnemies = revealedPlayers.filter(p => {
        // Skip if already handled in Priority 2 (Serial Killer, Pyromaniac, Werewolves)
        if (p.role.name === "Serial Killer" ||
            p.role.name === "Pyromaniac" ||
            p.role.team === "Werewolves") {
            return false;
        }

        // For wolves: other solo roles or revealed villagers
        if (cpuTeam === "Werewolves") {
            return p.role.team === "Village";
        }

        // For village: other solo roles
        if (cpuTeam === "Village") {
            return ["Fool"].includes(p.role.name); // Fool might be revealed
        }

        // For solo roles: anyone revealed
        return true;
    });

    if (otherRevealedEnemies.length > 0 && Math.random() < 0.6) {
        voteTarget = otherRevealedEnemies[Math.floor(Math.random() * otherRevealedEnemies.length)];
        emitVote(socket, cpu, voteTarget, gameId);
        return;
    }

    // PRIORITY 6: Team-specific strategic voting
    if (cpuTeam === "Werewolves") {
        voteTarget = werewolfStrategy(votablePlayers, teammates, votingState);
    } else if (cpuTeam === "Village") {
        voteTarget = villageStrategy(votablePlayers, votingState, cpuRole);
    } else {
        // Solo roles (Serial Killer, Pyromaniac, Fool)
        voteTarget = soloStrategy(votablePlayers, votingState, cpuRole);
    }

    if (voteTarget) {
        emitVote(socket, cpu, voteTarget, gameId);
        return;
    }

    // FALLBACK: Don't vote (villagers being cautious, or no valid target)
    // Previously this was random vote, now we just don't vote
    return;
}

// ========== HELPER FUNCTIONS ==========

function getTeammates(playersList, cpu) {
    // Only werewolves know their teammates
    if (cpu.role.team === "Werewolves") {
        return playersList.filter(p =>
            p.id !== cpu.id &&
            p.isAlive &&
            p.role.team === "Werewolves"
        );
    }

    // Villagers only know revealed teammates
    if (cpu.role.team === "Village") {
        return playersList.filter(p =>
            p.id !== cpu.id &&
            p.isAlive &&
            p.isRevealed &&
            p.role.team === "Village"
        );
    }

    // Solo roles have no teammates
    return [];
}

function isTeammate(player, teammates) {
    return teammates.some(t => t.id === player.id);
}

function getVotingState(votablePlayers) {
    const playersWithVotes = votablePlayers
        .filter(p => p.voteAgainst > 0)
        .sort((a, b) => b.voteAgainst - a.voteAgainst);

    return {
        playersWithVotes: playersWithVotes,
        leadingPlayer: playersWithVotes[0] || null,
        leadingVotes: playersWithVotes[0]?.voteAgainst || 0,
        secondPlayer: playersWithVotes[1] || null,
        secondVotes: playersWithVotes[1]?.voteAgainst || 0
    };
}

// ========== TEAM STRATEGIES ==========

function werewolfStrategy(votablePlayers, teammates, votingState) {
    // Wolves want to eliminate villagers while blending in

    const nonWolves = votablePlayers.filter(p => !isTeammate(p, teammates));

    // 40% chance: Vote for whoever has some votes (blend in)
    if (votingState.playersWithVotes.length > 0 && Math.random() < 0.4) {
        const viableTargets = votingState.playersWithVotes.filter(p =>
            !isTeammate(p, teammates)
        );
        if (viableTargets.length > 0) {
            return viableTargets[0];
        }
    }

    // 30% chance: Vote for a quiet player (no votes yet)
    const quietPlayers = nonWolves.filter(p => p.voteAgainst === 0);
    if (quietPlayers.length > 0 && Math.random() < 0.3) {
        return quietPlayers[Math.floor(Math.random() * quietPlayers.length)];
    }

    // Default: Random non-wolf
    if (nonWolves.length > 0) {
        return nonWolves[Math.floor(Math.random() * nonWolves.length)];
    }

    return null;
}

function villageStrategy(votablePlayers, votingState, cpuRole) {
    // Village votes cautiously - they don't want to eliminate randomly

    // Check if there's any good reason to vote (revealed threats or strong suspicion)
    const hasGoodTarget = votingState.playersWithVotes.some(p =>
        p.isRevealed && (
            p.role.team === "Werewolves" ||
            p.role.name === "Serial Killer" ||
            p.role.name === "Pyromaniac"
        )
    );

    // If no good target exists, villagers often skip voting
    if (!hasGoodTarget) {
        // 60% chance to NOT vote if there's no clear threat
        if (Math.random() < 0.6) {
            return null; // Don't vote
        }
    }

    // 40% chance: Join a bandwagon if there is one (2+ votes) - reduced from 50%
    if (votingState.leadingVotes >= 2 && Math.random() < 0.4) {
        return votingState.leadingPlayer;
    }

    // 25% chance: Vote for someone who's already being voted (safety in numbers) - reduced from 30%
    if (votingState.playersWithVotes.length > 0 && Math.random() < 0.25) {
        const randomVoted = votingState.playersWithVotes[
            Math.floor(Math.random() * votingState.playersWithVotes.length)
        ];
        return randomVoted;
    }

    // 30% chance to not vote at all (cautious behavior)
    if (Math.random() < 0.3) {
        return null;
    }

    // Default: Random vote (only 15% of cases reach here)
    return votablePlayers[Math.floor(Math.random() * votablePlayers.length)];
}

function soloStrategy(votablePlayers, votingState, cpuRole) {
    // Fool wants to be voted out - act suspicious
    if (cpuRole === "Fool") {
        // 40% chance: Vote against the bandwagon (suspicious)
        if (votingState.leadingPlayer && Math.random() < 0.4) {
            const notLeading = votablePlayers.filter(p =>
                p.id !== votingState.leadingPlayer.id && p.voteAgainst === 0
            );
            if (notLeading.length > 0) {
                return notLeading[Math.floor(Math.random() * notLeading.length)];
            }
        }

        // 30% chance: Random vote (erratic behavior)
        if (Math.random() < 0.3) {
            return votablePlayers[Math.floor(Math.random() * votablePlayers.length)];
        }
    }

    // Serial Killer & Pyromaniac: Create chaos, vote strategically
    // 45% chance: Bandwagon (blend in)
    if (votingState.leadingVotes >= 2 && Math.random() < 0.45) {
        return votingState.leadingPlayer;
    }

    // 35% chance: Vote for someone with some votes
    if (votingState.playersWithVotes.length > 0 && Math.random() < 0.35) {
        return votingState.playersWithVotes[
            Math.floor(Math.random() * votingState.playersWithVotes.length)
        ];
    }

    // Default: Random
    return votablePlayers[Math.floor(Math.random() * votablePlayers.length)];
}

// ========== EMIT VOTE ==========

function emitVote(socket, cpu, voteTarget, gameId) {
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