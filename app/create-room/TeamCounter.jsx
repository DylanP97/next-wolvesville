"use client";

import { Badge, Avatar } from "@nextui-org/react";

const TeamCounter = ({ team }) => {
  return (
    <Badge content="5" color="warning" variant="solid">
      <Avatar radius="md" src={team.image} />
    </Badge>
  );
};

export default TeamCounter;