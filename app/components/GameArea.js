import React, { useEffect, useState } from "react";
import PlayersGrid from "./PlayersGrid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSun, faMoon } from "@fortawesome/free-solid-svg-icons";
import characters from "../data/characters";

const GameArea = ({ playerName }) => {
  const [timeOfTheDay, setTimeOfTheDay] = useState("nighttime");
  const [timeLeft, setTimeLeft] = useState(10000);
  const [dayCount, setDayCount] = useState(0);
  const [playersAlive, setPlayersAlive] = useState([]);

  const initialPlayersList = [
    {
      id: 0,
      name: `${playerName}`,
      role: "my role",
    },
    {
      id: 1,
      name: "Other Player 1",
      role: "",
      isAlive: true,
      roleIsPublic: false,
    },
    {
      id: 2,
      name: "Other Player 2",
      role: "",
      isAlive: true,
      roleIsPublic: false,
    },
    {
      id: 3,
      name: "Other Player 3",
      role: "",
      isAlive: true,
      roleIsPublic: false,
    },
    {
      id: 4,
      name: "Other Player 4",
      role: "",
      isAlive: true,
      roleIsPublic: false,
    },
    {
      id: 5,
      name: "Other Player 5",
      role: "",
      isAlive: true,
      roleIsPublic: false,
    },
    {
      id: 6,
      name: "Other Player 6",
      role: "",
      isAlive: true,
      roleIsPublic: false,
    },
    {
      id: 7,
      name: "Other Player 7",
      role: "",
      isAlive: true,
      roleIsPublic: false,
    },
    {
      id: 8,
      name: "Other Player 8",
      role: "",
      isAlive: true,
      roleIsPublic: false,
    },
    {
      id: 9,
      name: "Other Player 9",
      role: "",
      isAlive: true,
      roleIsPublic: false,
    },
  ];

  const assignedRoles = new Set(); // Keep track of assigned roles
  const randomRoles = initialPlayersList.map((player, index) => {
    let randomCharacter;
    do {
      randomCharacter =
        characters[Math.floor(Math.random() * characters.length)];
    } while (assignedRoles.has(randomCharacter.name)); // Ensure unique roles
    assignedRoles.add(randomCharacter.name); // Mark role as assigned
    return {
      ...player,
      role: randomCharacter,
    };
  });
  const [updatedPlayersList, setUpdatedPlayersList] = useState(randomRoles);

  const durations = {
    daytime: 10000,
    nighttime: 5000,
  };

  const formatTime = (milliseconds) => {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = ((milliseconds % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (timeOfTheDay === "nighttime")
        setDayCount((prevDayCount) => prevDayCount + 1);
      setTimeOfTheDay(timeOfTheDay === "daytime" ? "nighttime" : "daytime");
      setTimeLeft(10000);
    }, 10000);

    const timerId = setInterval(() => {
      setTimeLeft((prevTimeLeft) => prevTimeLeft - 1000);
    }, 1000);

    return () => {
      clearInterval(intervalId);
      clearInterval(timerId);
    };
  }, [timeOfTheDay]);

  return (
    <section
      className={`${
        timeOfTheDay === "daytime" ? "bg-blue-500" : "bg-zinc-900"
      } w-full p-4 rounded-xl`}>
      <p>
        {timeOfTheDay === "daytime" ? (
          <>
            <FontAwesomeIcon icon={faSun} /> Daytime{" "}
          </>
        ) : (
          <>
            <FontAwesomeIcon icon={faMoon} /> Nighttime{" "}
          </>
        )}
        - Time Left: {formatTime(timeLeft)}
      </p>

      <p>Day n°{dayCount}</p>

      <PlayersGrid playersList={updatedPlayersList} playerName={playerName} />

      <div className="chatbox bg-white rounded-xl shadow-lg p-4 ">
        <h2 className="text-black ">Chat box</h2>
      </div>
    </section>
  );
};

export default GameArea;
