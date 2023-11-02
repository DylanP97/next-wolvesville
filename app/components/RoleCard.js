"use client";

import React from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Image,
  CardFooter,
  Button,
  Divider,
} from "@nextui-org/react";
import Link from "next/link";

const RoleCard = ({ character }) => {
  return (
    <Card className="max-w-[400px] bg-gray-900 m-2 p-2 rounded-xl">
      <CardHeader className="flex gap-3 p-2">
        <Image
          alt="nextui logo"
          height={40}
          radius="sm"
          src={character.image.src}
          width={40}
        />
        <div className="flex flex-col">
          <p className="text-md">{character.name}</p>
          <p className="text-small text-default-500">{character.maxNbrInGame} in the game</p>
        </div>
      </CardHeader>
      <Divider />
      <CardBody className="p-2">
        <p>{character.description}</p>
      </CardBody>
      <Divider />
      <CardFooter>

      </CardFooter>
    </Card>
  );
};

export default RoleCard;
