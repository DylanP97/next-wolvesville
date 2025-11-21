"use client";

import { Button } from "@nextui-org/react";
import { useState, useEffect } from "react";
import { useAuth } from "./providers/AuthProvider";
import CreateRoomStep1 from "./CreateRoomStep1";
import CreateRoomStep2 from "./CreateRoomStep2";
import CreateRoomStep3 from "./CreateRoomStep3";
import CreateRoomStep4 from "./CreateRoomStep4";
import { useTranslation } from "react-i18next";
import { fetchRoles, fetchTeams } from "./lib/fetch";
import { btnClassNames } from "./lib/styles";

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
  const [nbrUserPlayers, setNbrUserPlayers] = useState(1);
  const [preferredRole, setPreferredRole] = useState(null);

  const [creationStep, setCreationStep] = useState(1);

  const steps = {
    1: t("create.stepTwo"),
    2: t("create.stepThree"),
    3: t("create.stepFour"),
    4: `${t("create.stepFive")}: ${roomName}`,
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

    availableRoles.forEach((r) => {
      for (let i = 0; i < r.count; i++) {
        updatedRoles.push(r);
      }
    });

    setSelectedRoles(updatedRoles);
    // Set default user players to total players (all human, no CPU)
    if (updatedRoles.length > 0 && nbrUserPlayers === 0) {
      setNbrUserPlayers(updatedRoles.length);
    }
  }, [availableRoles]);

  useEffect(() => {
    let selectedRolesTeamsArray = selectedRoles.map((role) => role.team);
    let filteredTeams = availableTeams.filter((team) =>
      selectedRolesTeamsArray.includes(team.name)
    );
    setSelectedRolesTeam(filteredTeams);

    // Update nbrUserPlayers if it exceeds new total
    if (nbrUserPlayers > selectedRoles.length) {
      setNbrUserPlayers(selectedRoles.length);
    }
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

  const handleRoleSelection = (keys) => {
    const selected = Array.from(keys)[0];
    setPreferredRole(selected || null);
  };

  const getAvailableRolesForSelection = () => {
    const uniqueRoles = availableRoles.filter(role => role.count > 0);
    return uniqueRoles;
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

    const nbrCPUPlayers = selectedRoles.length - nbrUserPlayers;

    const newRoom = {
      id: Date.now(),
      name: roomName,
      createdBy: username,
      nbrOfPlayers: selectedRoles.length,
      nbrUserPlayers: nbrUserPlayers,
      nbrCPUPlayers: nbrCPUPlayers,
      selectedRoles: selectedRoles,
      usersInTheRoom: [{ username, socketId, avatar, preferredRole }],
      isLaunched: false,
    };

    socket.emit("createRoom", newRoom);
    addRoom(newRoom);
    setCreated(true);
  };

  const autoFillRoles = () => {
    setAvailableRoles(prev =>
      prev.map(role => ({
        ...role,
        count: selectedRoles.length === 0 ? 1 : 0
      }))
    );
  };


  const generateStep = () => {
    switch (creationStep) {
      case 1:
        return (
          <CreateRoomStep1
            availableRoles={availableRoles}
            handleRoleChange={handleRoleChange}
            selectedRoles={selectedRoles}
            onNext={toNextStep}
            errorMessage={errorMessage}
            autoFillRoles={autoFillRoles}
          />
        );
      case 2:
        return (
          <CreateRoomStep2
            totalPlayers={selectedRoles.length}
            nbrUserPlayers={nbrUserPlayers}
            setNbrUserPlayers={setNbrUserPlayers}
            onNext={toNextStep}
            onPrevious={toPreviousStep}
            errorMessage={errorMessage}
          />
        );
      case 3:
        return (
          <CreateRoomStep3
            preferredRole={preferredRole}
            handleRoleSelection={handleRoleSelection}
            getAvailableRolesForSelection={getAvailableRolesForSelection}
            availableRoles={availableRoles}
            onNext={toNextStep}
            onPrevious={toPreviousStep}
          />
        );
      case 4:
        return (
          <CreateRoomStep4
            selectedRoles={selectedRoles}
            nbrUserPlayers={nbrUserPlayers}
            preferredRole={preferredRole}
            username={username}
            onPrevious={toPreviousStep}
            onSubmit={submitNewRoom}
          />
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
    if (creationStep === 2 && nbrUserPlayers < 1) {
      setErrorMessage(t("create.error.needAtLeastOnePlayer"));
      return;
    }
    setCreationStep(creationStep + 1);
  };

  return (
    <div className="relative top-[70px] w-full p-4 flex flex-grow flex-col justify-between">
      {created ? (
        <h1 className="text-white">{t("create.roomCreatedWaitingUsers")}</h1>
      ) : (
        <div className="py-4">
          <div>
            <h1 className="text-white text-3xl font-bold mb-2 font-wolf">
              {t("menu.2")}
            </h1>
            <h2 className="text-white font-bold mb-2 font-wolf">
              {creationStep}. {steps[creationStep]}
            </h2>
          </div>
          <div className="flex flex-grow flex-col">
            {generateStep()}
            {errorMessage && creationStep !== 1 && (
              <p className="mt-2 text-primary-foreground text-sm">
                {errorMessage}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateRoom;