"use client";

import { Input, User, Button, Divider } from "@nextui-org/react";
import { useState, useEffect } from "react";
import { useAuth } from "../providers/AuthProvider";
import RoleCheckbox from "./RoleCheckbox";
import TeamCounter from "./TeamCounter";
import GoBackBtn from "../components/GoBackBtn";
import { useTranslation } from "react-i18next";

const CreateRoom = () => {
  const { t } = useTranslation();
  const { username, socket, addRoom, socketId, avatar } = useAuth();
  const [availableRoles, setAvailableRoles] = useState([]);
  const [availableTeams, setAvailableTeams] = useState([]);
  const [roomName, setRoomName] = useState("");
  const [creationError, setCreationError] = useState("");
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
    if (selectedRoles.length < 2) {
      setCreationError("At least 2 players please.");
      return;
    } else if (selectedRoles.length > 16) {
      setCreationError("16 players at most.");
      return;
    } else if (!roomName) {
      setCreationError("You have to give a name to your room.");
      return;
    } else {
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
    }
  };

  return (
    <div className="w-full bg-black p-4">
      {created ? (
        <h1 className="text-white">The room has been created...</h1>
      ) : (
        <>
          <h1 className="text-white text-3xl font-bold mb-2">{t("menu.2")}</h1>
          <div className="flex flex-col">
            <Input
              color="secondary"
              isRequired
              type="text"
              label="Enter a room name :"
              className="max-w-xs ws-60 bg-white rounded-xl"
              onChange={(e) => setRoomName(e.target.value)}
            />
            <Divider className="my-2" />
            <div className="flex items-center gap-2">
              <Button
                color="secondary"
                variant="shadow"
                className="text-white w-60 transition-all hover:scale-[105%]"
                onClick={() => submitNewRoom()}
              >
                Create Room
              </Button>
              <p className="text-white text-sm">{creationError}</p>
            </div>
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
      <br />
      <GoBackBtn />
    </div>
  );
};

export default CreateRoom;
