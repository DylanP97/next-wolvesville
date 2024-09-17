"use client";

import { Badge, Avatar } from "@nextui-org/react";

const TeamCounter = ({ team, selectedPlayers }) => {
  return (
    <Badge content={selectedPlayers.length} color="warning" variant="solid">
      <Avatar radius="md" src={team.image} />
      <p>{team.name}</p>
    </Badge>
  );
};

export default TeamCounter;
