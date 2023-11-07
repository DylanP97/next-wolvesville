import { killSelectedPlayer } from "./gameActions";

export const shootBullet = (
  action,
  updatedPlayersList,
  setUpdatedPlayersList,
  displayAction
) => {
  killSelectedPlayer(action.selectedPlayer.id, setUpdatedPlayersList);
  displayAction(
    `The shooter has shot ${
      updatedPlayersList[action.selectedPlayer.id].name
    } this night !`
  );
  checkIfIsInLove(
    action.selectedPlayer,
    updatedPlayersList,
    setUpdatedPlayersList,
    displayAction
  );
};

export const arrestPlayer = (
  action,
  updatedPlayersList,
  setUpdatedPlayersList,
  displayAction
) => {
  setUpdatedPlayersList((prevPlayersList) => {
    return prevPlayersList.map((player) => {
      if (player.id === action.selectedPlayer.id) {
        return {
          ...player,
          isUnderArrest: true,
        };
      }
      return player;
    });
  });
  displayAction(
    `The sheriff has handcuffed ${
      updatedPlayersList[action.selectedPlayer.id].name
    }!`
  );
};

export const releasePrisoners = (setUpdatedPlayersList) => {
  setUpdatedPlayersList((prevPlayersList) => {
    return prevPlayersList.map((player) => {
      if (player.isUnderArrest) {
        return {
          ...player,
          isUnderArrest: false,
        };
      }
      return player;
    });
  });
};

export const revealPlayer = (
  action,
  updatedPlayersList,
  setUpdatedPlayersList,
  displayAction
) => {
  setUpdatedPlayersList((prevPlayersList) => {
    return prevPlayersList.map((player) => {
      if (player.id === action.selectedPlayer.id) {
        return {
          ...player,
          isRevealed: true,
        };
      }
      return player;
    });
    
  });
  displayAction(
    `The seer's magical crystal ball unveiled the identity of ${
      updatedPlayersList[action.selectedPlayer.id].name
    }!`
  );
};

export const checkIfIsInLove = (
  player,
  updatedPlayersList,
  setUpdatedPlayersList,
  displayAction
) => {
  if (player.isInLove) {
    const lovers = findLovers(updatedPlayersList);
    const partner = lovers.find((partner) => partner.id !== player.id);
    console.log(partner);
    killSelectedPlayer(partner.id, setUpdatedPlayersList);
    displayAction(
      `${partner.name} is dead because of its loving relation with ${player.name}!`
    );
  } else {
    return;
  }
};

export const findLovers = (updatedPlayersList) => {
  const lovers = updatedPlayersList.filter((player) => player.isInLove);
  return lovers;
};

export const linkLovers = (action, setUpdatedPlayersList) => {
  setUpdatedPlayersList((prevPlayersList) => {
    return prevPlayersList.map((player) => {
      console.log(action.selectedPlayer);
      if (player.id === action.selectedPlayer) {
        return {
          ...player,
          isInLove: true,
        };
        console.log(player);
      }
      return player;
    });
  });
};
