"use client";

import { Input, Button, Divider, CheckboxGroup, Checkbox } from "@nextui-org/react";
import { useState } from "react";
import { useAuth } from "../../providers/AuthProvider";
import roles from "../../lib/roles";

const CreateRoom = () => {
  const [roomName, setRoomName] = useState("");
  const [nbrOfPlayers, setNbrOfPlayers] = useState(2);
  const [selectedRoles, setSelectedRoles] = useState([]);
  const { username, socket, addRoom, socketId } = useAuth();

  const submitNewRoom = () => {
      const newRoom = {
        id: Date.now(),
        name: roomName,
        createdBy: username,
        nbrOfPlayers: nbrOfPlayers,
        selectedRoles: selectedRoles,
        usersInTheRoom: [{ username, socketId }]
      };
      socket.emit("createRoom", newRoom);  
      addRoom(newRoom);
  };

  return (
    <div className="w-full bg-black p-4">
      <h1 className="text-white text-3xl font-bold">Create a new room</h1>
      <div className="m-4">
        <Input
          color="secondary"
          isRequired
          type="text"
          label="Enter a room name :"
          className="max-w-xs ws-60"
          onChange={(e) => setRoomName(e.target.value)}
        />
        <Divider className="my-2" />
        <Input
          color="secondary"
          type="number"
          className="max-w-xs ws-60"
          defaultValue={nbrOfPlayers}
          labelPlacement="outside"
          size="lg"
          min={2}
          max={16}
          onChange={(event) => setNbrOfPlayers(Number(event.target.value))}
          endContent={
            <div className="pointer-events-none flex items-center">
              <span className="text-default-400 text-small text-purple-500"> players</span>
            </div>
          }
        />
        <Divider className="my-2" />
        <CheckboxGroup
          className="my-4"
          label={`Select ${nbrOfPlayers} roles`}
          defaultValue={["Villager", "Alpha Werewolf"]}
          value={selectedRoles}
          onValueChange={setSelectedRoles}>
          {roles.map((character, index) => {
            if (character.name !== "Accomplice")
              return (
                <Checkbox key={character.name} value={character}>
                  <span className="text-white">
                    {character.name} {" ("}{character.team.join(', ')}{") "}
                  </span>
                </Checkbox>
              );
          })}
        </CheckboxGroup>
        <Divider className="my-2" />
        {selectedRoles.length === nbrOfPlayers && roomName && (
          <Button color="secondary" variant="ghost" onClick={() => submitNewRoom()}>
            Create Room
          </Button>
        )}
      </div>
      <Button color="primary" variant="ghost" onClick={() => window.history.back()}>
        Go Back
      </Button>
    </div>
  );
};

export default CreateRoom;
