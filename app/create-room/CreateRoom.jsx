"use client";

import { Input, Button, Divider, CheckboxGroup, Checkbox } from "@nextui-org/react";
import { useState, useEffect } from "react";
import { useAuth } from "../providers/AuthProvider";

const CreateRoom = () => {
  const [roomName, setRoomName] = useState("");
  const [nbrOfPlayers, setNbrOfPlayers] = useState(2);
  const [selectedRoles, setSelectedRoles] = useState([]);
  const { username, socket, addRoom, socketId, avatar } = useAuth();
  const [availableRoles, setAvailableRoles] = useState([]);
  const [created, setCreated] = useState(false)

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await fetch(process.env.NEXT_PUBLIC_API_URL + "/api/roles");
        if (response.ok) {
          const rolesData = await response.json();
          setAvailableRoles(rolesData);
        } else {
          console.error("Failed to fetch roles");
        }
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    };

    fetchRoles();
  }, []);

  const submitNewRoom = () => {
    const newRoom = {
      id: Date.now(),
      name: roomName,
      createdBy: username,
      nbrOfPlayers: nbrOfPlayers,
      selectedRoles: selectedRoles,
      usersInTheRoom: [{ username, socketId, avatar }]
    };
    socket.emit("createRoom", newRoom);
    addRoom(newRoom);
    setCreated(true);
  };

  return (
    <div className="w-full bg-black p-4">
      {
        created ? (
          <>
            <h1 className="text-white">
              The room has been created...
            </h1>
          </>
        ) : (
          <>
            <h1 className="text-white text-3xl font-bold">Create a new room</h1>
            <div className="m-4 flex flex-col">
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
            </div>
            <CheckboxGroup
              className="my-4"
              label={`Select ${nbrOfPlayers} roles`}
              defaultValue={["Villager", "Alpha Werewolf"]}
              value={selectedRoles}
              onValueChange={setSelectedRoles}>
              {availableRoles.map((character, index) => {
                if (character.name !== "Accomplice")
                  return (
                    <Checkbox key={character.name} value={character} size="sm">
                      <span className="text-white text-sm">
                        {character.name} {" ("}{character.team.join(', ')}{") "}
                      </span>
                    </Checkbox>
                  );
              })}
            </CheckboxGroup>
          </>
        )
      }
      <Divider className="my-2" />
      <div className="flex gap-2">
        {!created && selectedRoles.length === nbrOfPlayers && roomName && (
          <Button color="secondary" variant="ghost" onClick={() => submitNewRoom()}>
            Create Room
          </Button>
        )}
        <Button color="primary" variant="ghost" onClick={() => window.history.back()}>
          Go Back
        </Button>
      </div>
    </div>
  );
};

export default CreateRoom;
