"use client";

import { useMemo, useState } from "react";
import AvatarUI from "./AvatarUI";
import { CardHeader, Input } from "@nextui-org/react";
import { Card, CardBody } from "@nextui-org/react";
import { Button } from "@nextui-org/react";
import { schema } from "@dicebear/core";
import { avataaars } from "@dicebear/collection";

const ProfileCard = () => {
  const [playerUserName, setPlayerUserName] = useState("");
  const [playerEmail, setPlayerEmail] = useState("");

  const options = {
    ...schema.properties,
    ...avataaars.schema.properties,
  };

  const validateEmail = (value) => value.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}$/i);

  const isInvalid = useMemo(() => {
    if (playerEmail === "") return false;

    return validateEmail(playerEmail) ? false : true;
  }, [playerEmail]);

  return (
    <Card>
      <CardHeader className="flex flex-col gap-3">
        <div className="font-bold text-xl">Edit Your Profile</div>
        <p className="text-gray-700 text-base">Welcome, {playerUserName || "Guest"}!</p>
        <AvatarUI heightAndWidth={140} />
      </CardHeader>
      <CardBody>
        <div className="px-6 py-4">
          <Input
            type="text"
            label="Username"
            variant="bordered"
            value={playerUserName}
            onValueChange={setPlayerUserName}
            className="max-w-xs"
          />
          <br />
          <Input
            type="email"
            label="Email"
            variant="bordered"
            value={playerEmail}
            defaultValue="johndoe@email.com"
            onValueChange={setPlayerEmail}
            isInvalid={isInvalid}
            color={isInvalid && "error"}
            errorMessage={isInvalid && "Please enter a valid email"}
            className="max-w-xs"
          />
          <br />
          <Button
            color="primary"
            variant="ghost"
            className="mt-2 w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            // onClick={handleNameSubmit}
          >
            Submit
          </Button>
        </div>
      </CardBody>
    </Card>
  );
};

export default ProfileCard;
