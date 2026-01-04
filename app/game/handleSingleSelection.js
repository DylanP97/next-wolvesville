
import i18n from "../lib/i18n";

const handleSingleSelection = (player, clientPlayer, gameId, socket, actionType,
    selectionHelpers) => {
    const voteActions = {
        vote: () => {
            const nbr = clientPlayer.role.name === "Mayor" && clientPlayer.isRevealed ? 3 : 1;
            socket.emit("addVote", {
                type: "addVote",
                playerId: clientPlayer.id,
                playerName: clientPlayer.name,
                selectedPlayerId: player.id,
                selectedPlayerName: player.name,
                nbr,
            }, gameId);
        },

        wolfVote: () => {
            const nbr = clientPlayer.role.name === "Alpha Werewolf" ? 2 : 1;
            socket.emit("addWolfVote", {
                playerId: clientPlayer.id,
                playerName: clientPlayer.name,
                selectedPlayerId: player.id,
                selectedPlayerName: player.name,
                nbr,
            }, gameId);

            // Wolf Seer special case: can still uncover role after voting
            if (clientPlayer.role.name === "Wolf Seer") {
                selectionHelpers.blockAction("wolfVote");
                selectionHelpers.resetToIdle();  // <-- USE NEW METHOD
                return;
            }
        },
    };

    const specialActions = {
        execute: () => socket.emit("executePrisoner", {
            type: actionType,
            killerId: clientPlayer.id,
            selectedPlayerId: player.id,
            selectedPlayerName: player.name,
        }, gameId),

        reveal: () => socket.emit("revealPlayer", {
            type: actionType,
            seerId: clientPlayer.id,
            selectedPlayerId: player.id,
            selectedPlayerName: player.name,
            selectedPlayerRole: i18n.language === "fr" ? player.role.nameFR : player.role.name,
        }, gameId),

        shoot: () => socket.emit("shootBullet", {
            type: actionType,
            gunnerId: clientPlayer.id,
            selectedPlayerId: player.id,
            selectedPlayerName: player.name,
        }, gameId),

        heal: () => socket.emit("heal", {
            type: actionType,
            playerId: clientPlayer.id,
            selectedPlayerId: player.id,
            selectedPlayerName: player.name,
        }, gameId),

        protectPotion: () => socket.emit("protectPotion", {
            type: actionType,
            playerId: clientPlayer.id,
            selectedPlayerId: player.id,
            selectedPlayerName: player.name,
        }, gameId),

        poisonPotion: () => socket.emit("poisonPotion", {
            type: actionType,
            playerId: clientPlayer.id,
            selectedPlayerId: player.id,
            selectedPlayerName: player.name,
        }, gameId),

        uncoverRole: () => {
            socket.emit("uncoverRole", {
                type: actionType,
                wolfSeerId: clientPlayer.id,
                selectedPlayerId: player.id,
                selectedPlayerName: player.name,
            }, gameId);

            // Wolf Seer can still wolf vote after uncovering
            selectionHelpers.resetToIdle();  // <-- USE NEW METHOD
            return;
        },

        loot: () => {
            socket.emit("lootGrave", {
                type: actionType,
                graveRobberId: clientPlayer.id,
                selectedPlayerId: player.id,
                selectedPlayerName: player.name,
                selectedPlayerRole: player.role, // Send the dead player's role
            }, gameId);
        },

        revive: () => {
            socket.emit("revive", {
                type: actionType,
                playerId: clientPlayer.id,
                selectedPlayerId: player.id,
                selectedPlayerName: player.name,
            }, gameId);
        },

        chooseJuniorWolfDeathRevenge: () => {
            socket.emit("chooseJuniorWolfDeathRevenge", {
                juniorWolfId: player.id,
                selectedPlayerId: player.id,
            }, gameId)
        },

        pour: () => {
            socket.emit("pourGasoline", {
                type: actionType,
                pyroId: clientPlayer.id,
                selectedPlayerId: player.id,
                selectedPlayerName: player.name,
            }, gameId)
        },

        putNightmare: () => {
            socket.emit("putNightmare", {
                type: actionType,
                playerId: clientPlayer.id,
                playerName: clientPlayer.name,
                selectedPlayerId: player.id,
                selectedPlayerName: player.name,
            }, gameId);
        },
    };

    // Execute the action
    const action = voteActions[actionType] || specialActions[actionType];

    if (action) {
        action();
    } else {
        // Generic action
        socket.emit("registerAction", {
            type: actionType,
            playerId: clientPlayer.id,
            selectedPlayerId: player.id,
            selectedPlayerName: player.name,
            actionTime: clientPlayer.role.canPerform1.actionTime,
        }, gameId);
    }

    // Complete selection (unless special case handled above)
    if (actionType !== "uncoverRole" &&
        !(actionType === "wolfVote" && clientPlayer.role.name === "Wolf Seer")) {
        selectionHelpers.complete(actionType);
    }
};

export default handleSingleSelection;