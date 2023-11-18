"use client";

import { Card, CardHeader, CardBody, CardFooter, Divider, Link, Image } from "@nextui-org/react";

const RoleCard = ({ character }) => {
  return (
    <Card className="max-w-[400px]">
      <CardHeader className="flex gap-3">
        <Image
          alt="nextui logo"
          height={40}
          radius="sm"
          src={character.image.src}
          width={40}
        />
        <div className="flex flex-col">
          <p className="text-md">{character.name}</p>
          <p className="text-small text-default-500">nextui.org</p>
        </div>
      </CardHeader>
      <Divider />
      <CardBody>
        <p>{character.description}</p>
      </CardBody>
      <CardFooter></CardFooter>
    </Card>
  );
};

export default RoleCard;
