import rolesIcons from "@/public/roles";
import target from "@/public/game/target.png";
import handcuffs from "@/public/game/handcuffs.png";

const characters = [
  {
    name: "Civilian",
    maxNbrInGame: 5,
    canVote: true,
    canPerform: null,
    image: rolesIcons["man"],
    description:
      "A random civilian that can do nothing either complain or vote.",
  },
  {
    name: "Sheriff",
    maxNbrInGame: 1,
    canVote: true,
    canPerform: {
      label: "Handcuff a player for the next night",
      emoji: handcuffs,
      type: "arrest",
      needSelection: true,
      actionTime: "day",
    },
    image: rolesIcons["sheriff"],
    description:
      "The sheriff can decide to arrest the person he wants each day. The arrested person would be in jail for one night.",
  },
  {
    name: "Doctor",
    maxNbrInGame: 1,
    canVote: true,
    canPerform: null,
    image: rolesIcons["doctor"],
    description: "The doctor can protect the person he wants each night.",
  },
  {
    name: "Shooter",
    maxNbrInGame: 1,
    canVote: true,
    canPerform: {
      label: "Select someone to shoot him",
      emoji: target,
      type: "shoot",
      needSelection: true,
      actionTime: "night",
    },
    image: rolesIcons["shooter"],
    description:
      "The shooter has one bullet and can shoot the person he wants at night one time during the game.",
  },
  {
    name: "Detective",
    maxNbrInGame: 1,
    canVote: true,
    canPerform: null,
    image: rolesIcons["detective"],
    description:
      "The detective can check a person intentions (good / neutral / bad) during the night.",
  },
  {
    name: "Mayor",
    maxNbrInGame: 1,
    canVote: true,
    canPerform: null,
    image: rolesIcons["mayor"],
    description: "The mayor vote counts double.",
  },
  {
    name: "Fool",
    maxNbrInGame: 1,
    canVote: true,
    canPerform: null,
    image: rolesIcons["fool"],
    description:
      "The fool goal is that the people vote for him during the day! If that happens he wins the game.",
  },
  {
    name: "Bandit",
    maxNbrInGame: 2,
    canVote: true,
    canPerform: null,
    image: rolesIcons["bandit"],
    description:
      "The bandit goal is to be the last one alive. He can choose to teammate with someone. One bandit can kill one person each two nights.",
  },
  {
    name: "Reaper",
    maxNbrInGame: 1,
    canVote: true,
    canPerform: null,
    image: rolesIcons["reaper"],
    description:
      "The grim reaper has the mission to kill a specific person during a specific night. He will die if he doesn't get the requested soul.",
  },
  {
    name: "Terrorist",
    maxNbrInGame: 1,
    canVote: true,
    canPerform: null,
    image: rolesIcons["terrorist"],
    description:
      "The terrorist can choose to manufacture a bomb each night or choose to blow it up the night he wants. He might die with the explosion. The more nights he crafts its bomb the more damage it will do. The bomb can kill randomly any player.",
  },
];

export default characters;
