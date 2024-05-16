"use client";

import { Input, User, Button, Divider } from "@nextui-org/react";
import { useState, useEffect } from "react";
import { useAuth } from "../providers/AuthProvider";
import RoleCheckbox from "./RoleCheckbox";
import TeamCounter from "./TeamCounter";
import GoBackBtn from "../components/GoBackBtn";
import { useTranslation } from "react-i18next";
import { colorsForTeams } from "../lib/utils";

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
  const [nbrCPUPlayers, setNbrCPUPlayers] = useState(0);

  const [creationStep, setCreationStep] = useState(1);

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
    } else if (selectedRoles.length > 16) {
      setCreationError("16 players at most.");
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
        nbrUserPlayers: selectedRoles.length - nbrCPUPlayers,
        nbrCPUPlayers: nbrCPUPlayers,
        selectedRoles: selectedRoles,
        usersInTheRoom: [{ username, socketId, avatar }],
      };
      socket.emit("createRoom", newRoom);
      addRoom(newRoom);
      setCreated(true);
    }
  };

  const handleNbrCPUPlayers = (event) => {
    const newValue = Number(event.target.value);
    setNbrCPUPlayers(newValue);
  };

  const stepOne = () => {
    return (
      <Input
        color="secondary"
        className="max-w-xs ws-60 bg-white rounded-xl"
        isRequired
        type="text"
        label="Enter a room name:"
        onChange={(e) => setRoomName(e.target.value)}
      />
    );
  };

  const stepTwo = () => {
    return (
      <>
        <div className="flex flex-row items-center my-2">
          {selectedRoles.map((r, i) => {
            return (
              <User
                key={r.name + i + "-uc"}
                avatarProps={{
                  size: "sm",
                  src: r.image,
                  radius: "lg",
                }}
                className={`p-1 bg-[${colorsForTeams[r.team]}]`}
              />
            );
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
      </>
    );
  };

  const stepThree = () => {
    return (
      <div className="flex flex-col gap-4">
        <Input
          color="secondary"
          className="max-w-xs ws-60 bg-white rounded-xl"
          isRequired
          type="number"
          label="Number of CPU Players:"
          defaultValue={0}
          min={0}
          max={selectedRoles.length - 1}
          onChange={handleNbrCPUPlayers}
        />
        <Button
          color="secondary"
          variant="shadow"
          className="animate-pulse hover:bg-primary text-white w-60 transition-all hover:scale-[105%]"
          onClick={() => submitNewRoom()}
        >
          Create Room
        </Button>
        <p className="text-white text-sm">{creationError}</p>
      </div>
    );
  };

  const generateStep = () => {
    if (creationStep === 1) return stepOne();
    if (creationStep === 2) return stepTwo();
    if (creationStep === 3) return stepThree();
  };

  const toPreviousStep = () => {
    if (creationStep > 1) {
      setCreationStep(creationStep - 1);
    }
  };

  const toNextStep = () => {
    if (creationStep < 3) {
      setCreationStep(creationStep + 1);
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
            {generateStep()}
            <div className="flex flex-row gap-2 mt-4">
              {creationStep > 1 && (
                <Button
                  className="hover:scale-[105%] transition-all text-white"
                  color="secondary"
                  variant="solid"
                  onClick={() => toPreviousStep()}
                >
                  Previous Step
                </Button>
              )}
              {creationStep < 3 && (
                <Button
                  className="hover:scale-[105%] transition-all text-white"
                  color="secondary"
                  variant="solid"
                  onClick={() => toNextStep()}
                >
                  Next Step
                </Button>
              )}
            </div>
            {/* <p className="text-xs text-gray-200">
                {selectedRoles.length} total players
              </p>
              <p className="text-xs text-gray-200">
                *including {selectedRoles.length - nbrCPUPlayers} User players
              </p>
              <p className="text-xs text-gray-200">
                *including {nbrCPUPlayers} CPU players
              </p> */}
          </div>
          {/* <div className="flex gap-3 items-center">
              {selectedRolesTeam.map((t, i) => {
                return <TeamCounter team={t} key={t.name + i + "-tc"} />;
              })}
            </div> */}
        </>
      )}
      <Divider className="my-2" />
      <br />
      <GoBackBtn />
    </div>
  );
};

export default CreateRoom;
