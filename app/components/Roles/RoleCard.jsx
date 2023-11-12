"use client";

import {
  Card,
  CardHeader,
  CardBody,
  Image,
  CardFooter,
  Divider,
} from "@nextui-org/react";

const RoleCard = ({ character }) => {
  return (
    <Card className="w-[400px] h-40 bg-gray-900 m-2 p-2 rounded-xl">
      <CardHeader className="flex gap-3 p-2">
        <Image
          height={40}
          radius="sm"
          src={character.image.src}
          width={40}
          alt="nextui logo"
        />
        <div className="flex flex-col">
          <p className="text-xs">{character.name}</p>
          <p className="text-xs text-default-500">{character.maxNbrInGame} in the game</p>
        </div>
      </CardHeader>
      <Divider />
      <CardBody className="p-2">
        <p className="text-xs">{character.description}</p>
      </CardBody>
      <CardFooter>

      </CardFooter>
    </Card>
  );
};

export default RoleCard;
