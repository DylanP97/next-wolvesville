"use client";

import { Input, User, Button, Divider } from "@nextui-org/react";
import { useState, useEffect } from "react";
import { useAuth } from "../providers/AuthProvider";
import RoleChoice from "./RoleChoice";
import TeamCounter from "./TeamCounter";
import GoBackBtn from "../components/GoBackBtn";
import { useTranslation } from "react-i18next";
import { colorsForTeams } from "../lib/utils";
import { fetchRoles, fetchTeams } from "../lib/fetch";

const CreateRoom = () => {
  const { t } = useTranslation();
  const { username, socket, addRoom, socketId, avatar } = useAuth();
  const [availableRoles, setAvailableRoles] = useState([]);
  const [availableTeams, setAvailableTeams] = useState([]);
  const [roomName, setRoomName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [selectedRolesTeam, setSelectedRolesTeam] = useState([]);
  const [created, setCreated] = useState(false);
  const [nbrCPUPlayers, setNbrCPUPlayers] = useState(0);
  const [CPUPlayersMax, setCPUPlayersMax] = useState();

  const [creationStep, setCreationStep] = useState(1);

  const steps = {
    1: t("create.stepTwo"),
    2: t("create.stepThree"),
    3: `${t("create.stepFour")}: ${roomName}`,
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const teamsData = await fetchTeams();
        setAvailableTeams(teamsData || []);

        const rolesData = await fetchRoles();
        const filteredRoles = rolesData.filter((r) => r.status == 1);
        setAvailableRoles(filteredRoles.map((r) => ({ ...r, count: 0 })));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    let updatedRoles = [];

    availableRoles.map((r) => {
      for (let i = 0; i < r.count; i++) {
        updatedRoles.push(r);
      }
    });

    setSelectedRoles(updatedRoles);
  }, [availableRoles]);

  useEffect(() => {
    setCPUPlayersMax(selectedRoles.length - 1);
    let selectedRolesTeamsArray = selectedRoles.map((role) => role.team.join());
    let filteredTeams = availableTeams.filter((team) =>
      selectedRolesTeamsArray.includes(team.name)
    );
    setSelectedRolesTeam(filteredTeams);
  }, [selectedRoles]);

  useEffect(() => {
    generateRoomId();
  }, []);

  const generateRoomId = () => {
    const roomId = `${Math.random().toString(36).substr(2, 9)}`;
    setRoomName(roomId);
  };

  const handleRoleChange = (roleName, newCount) => {
    setAvailableRoles((prevAvailableRoles) =>
      prevAvailableRoles.map((role) =>
        role.name === roleName ? { ...role, count: newCount } : role
      )
    );
  };

  const handleNbrCPUPlayers = (event) => {
    setNbrCPUPlayers(Number(event.target.value));
  };

  const submitNewRoom = () => {
    if (selectedRoles.length < 2 || selectedRoles.length > 16) {
      setErrorMessage(t("create.error.numberOfPlayers"));
      return;
    }
    if (!roomName) {
      setErrorMessage(t("create.error.giveRoomName"));
      return;
    }

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
  };

  const generateStep = () => {
    switch (creationStep) {
      case 1:
        return (
          <>
            <p className="text-xs italic">
              {t("create.info.numberOnEachRole")}
            </p>
            <div className="flex flex-col md:flex-row justify-between my-2">
              <div className="">
                {availableRoles.map((role) => (
                  <RoleChoice
                    key={role.name + "-rolecheckbx"}
                    role={role}
                    handleRoleChange={handleRoleChange}
                    setAvailableRoles={setAvailableRoles}
                  />
                ))}
              </div>
            </div>
          </>
        );
      case 2:
        return (
          <div className="flex flex-col gap-4 py-2">
            <Input
              color="secondary"
              className="max-w-xs ws-60 bg-white rounded-xl"
              isRequired
              type="number"
              label={t("create.labelCPUNumber")}
              value={nbrCPUPlayers}
              min={0}
              max={CPUPlayersMax}
              onChange={handleNbrCPUPlayers}
            />
          </div>
        );
      case 3:
        return (
          <div className="flex flex-col py-2">
            <div className="flex flex-row flex-wrap items-center my-2">
              {selectedRoles.map((r, i) => (
                <User
                  key={r.name + i + "-uc"}
                  avatarProps={{
                    size: "sm",
                    src: r.image,
                    radius: "lg",
                  }}
                  className={`p-1 bg-[${colorsForTeams[r.team]}]`}
                />
              ))}
            </div>
            <p className="text-sm text-gray-200 my-2">
              {selectedRoles.length} {t("create.totalPlayers")}
            </p>
            <p className="text-sm text-gray-200">
              *{t("create.including")} {selectedRoles.length - nbrCPUPlayers}{" "}
              {t("create.userControlled")}
            </p>
            <p className="text-sm text-gray-200">
              *{t("create.including")} {nbrCPUPlayers}{" "}
              {t("create.CPUControlled")}
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  const toPreviousStep = () => {
    setErrorMessage("");
    if (creationStep > 1) {
      setCreationStep(creationStep - 1);
    }
  };

  const toNextStep = () => {
    setErrorMessage("");
    if (creationStep === 1 && !roomName) {
      setErrorMessage(t("create.error.giveRoomName"));
      return;
    }
    if (
      creationStep === 1 &&
      (selectedRoles.length < 2 || selectedRoles.length > 16)
    ) {
      setErrorMessage(t("create.error.numberOfPlayers"));
      return;
    }
    if (
      creationStep === 2 &&
      (nbrCPUPlayers < 0 || nbrCPUPlayers > CPUPlayersMax)
    ) {
      setErrorMessage(t("create.error.CPUNbrNotPossible"));
      return;
    }
    setCreationStep(creationStep + 1);
  };

  return (
    <div className="h-full w-full bg-background p-4 flex flex-grow flex-col justify-between">
      {created ? (
        <h1 className="text-white">{t("create.roomCreatedWaitingUsers")}</h1>
      ) : (
        <div className="py-4">
          <div>
            <h1 className="text-white text-3xl font-bold mb-2">
              {t("menu.2")}
            </h1>
            <h2 className="text-white font-bold mb-2">
              {creationStep}. {steps[creationStep]}
            </h2>
          </div>
          <div className="flex flex-grow flex-col">
            {generateStep()}
            <div className="flex flex-row gap-2">
              {creationStep > 1 && (
                <Button
                  className="hover:scale-[105%] transition-all"
                  color="secondary"
                  variant="solid"
                  onClick={toPreviousStep}
                >
                  {t("create.previousStep")}
                </Button>
              )}
              {creationStep < 3 && (
                <Button
                  className="hover:scale-[105%] transition-all"
                  color="primary"
                  variant="solid"
                  onClick={toNextStep}
                >
                  {t("create.nextStep")}
                </Button>
              )}
              {creationStep === 3 && (
                <Button
                  color="primary"
                  variant="shadow"
                  className="animate-pulse text-white w-60 transition-all hover:scale-[105%]"
                  onClick={submitNewRoom}
                >
                  {t("create.submit")}
                </Button>
              )}
            </div>
            {errorMessage && (
              <p className="mt-2 text-primary-foreground text-sm">
                {errorMessage}
              </p>
            )}
          </div>
        </div>
      )}
      <GoBackBtn />
    </div>
  );
};

export default CreateRoom;
