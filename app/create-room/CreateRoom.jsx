"use client";

import { Input, User, Button, Divider } from "@nextui-org/react";
import { useState, useEffect } from "react";
import { useAuth } from "../providers/AuthProvider";
import RoleCheckbox from "./RoleCheckbox";
import TeamCounter from "./TeamCounter";

const CreateRoom = () => {
  const { username, socket, addRoom, socketId, avatar } = useAuth();
  const [availableRoles, setAvailableRoles] = useState([]);
  const [availableTeams, setAvailableTeams] = useState([]);
  const [roomName, setRoomName] = useState("");
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [selectedRolesTeam, setSelectedRolesTeam] = useState([]);
  const [created, setCreated] = useState(false);

  const colorsForTeams = {
    village: "primary",
    werewolves: "secondary",
    others: "success",
  };

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await fetch(
          process.env.NEXT_PUBLIC_API_URL + "/api/teams"
        );
        if (response.ok) {
          const teamsData = await response.json();
          setAvailableTeams(teamsData);
        } else {
          console.error("Failed to fetch teams");
        }
      } catch (error) {
        console.error("Error fetching teams:", error);
      }
    };

    fetchTeams();
  }, []);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await fetch(
          process.env.NEXT_PUBLIC_API_URL + "/api/roles"
        );
        if (response.ok) {
          const rolesData = await response.json();
          setAvailableRoles(rolesData.filter((r) => r.status == 1));
        } else {
          console.error("Failed to fetch roles");
        }
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    };

    fetchRoles();
  }, []);

  useEffect(() => {
    setSelectedRolesTeam(
      availableTeams.filter((team) =>
        selectedRoles.map((role) => role.team).includes(team.name)
      )
    );
    // console.log(selectedRolesTeam);
  }, [selectedRoles]);

  const handleRoleChange = (roleName, newCount) => {
    let updatedRoles = [...selectedRoles];
    updatedRoles = updatedRoles.filter((r) => r.name !== roleName);
    const role = availableRoles.find((r) => r.name === roleName);

    if (role) {
      for (let i = 0; i < newCount; i++) {
        updatedRoles.push(role);
      }

      setSelectedRoles(updatedRoles);
    } else {
      console.error(`Role '${roleName}' not found in availableRoles.`);
    }
  };

  const submitNewRoom = () => {
    const newRoom = {
      id: Date.now(),
      name: roomName,
      createdBy: username,
      nbrOfPlayers: selectedRoles.length,
      selectedRoles: selectedRoles,
      usersInTheRoom: [{ username, socketId, avatar }],
    };
    socket.emit("createRoom", newRoom);
    addRoom(newRoom);
    setCreated(true);
  };

  return (
    <div className="w-full bg-black p-4">
      {created ? (
        <h1 className="text-white">The room has been created...</h1>
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
            <div className="flex items-center h-14 m-2">
              <p className="text-gray-200">{selectedRoles.length} players: </p>
              {selectedRoles.map((r, i) => {
                return (
                  <User
                    key={r.name + i + "-uc"}
                    avatarProps={{
                      size: "sm",
                      src: r.image,
                      color: colorsForTeams[r.team],
                      radius: "lg",
                    }}
                    className="p-1"
                  />
                );
              })}
            </div>
            <div className="flex gap-3 items-center">
              {selectedRolesTeam.map((t, i) => {
                return <TeamCounter team={t} key={t.name + i + "-tc"} />;
              })}
            </div>
            {availableRoles.map((role) => {
              if (role.name !== "Accomplice")
                return (
                  <RoleCheckbox
                    role={role}
                    key={role.name}
                    onChange={handleRoleChange}
                  />
                );
            })}
          </div>
        </>
      )}
      <Divider className="my-2" />
      <div className="flex gap-2">
        {!created &&
          (selectedRoles.length >= 2) &&
          (selectedRoles.length <= 16) &&
          roomName && (
            <Button
              color="secondary"
              variant="shadow"
              onClick={() => submitNewRoom()}
            >
              Create Room
            </Button>
          )}
      </div>
    </div>
  );
};

export default CreateRoom;
