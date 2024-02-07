"use client";

import { Card, CardHeader, CardBody, CardFooter, Divider, Link, Image } from "@nextui-org/react";

const RoleCard = ({ role }) => {
  const teamsString = role.team.join(", ");

  return (
    <Card className="max-w-[400px]">
      <CardHeader className="flex gap-3">
        <Image alt={role.name} height={40} radius="sm" src={role.image} width={40} />
        <div className="flex flex-col">
          <p className="text-md">{role.name}</p>
          <p className="text-small text-default-500">Team{role.team.length > 1 && "s"}: {teamsString}</p>
        </div>
      </CardHeader>
      <Divider />
      <CardBody>
        <p className="text-sm">{role.description}</p>
      </CardBody>
      <CardFooter></CardFooter>
    </Card>
  );
};

export default RoleCard;
