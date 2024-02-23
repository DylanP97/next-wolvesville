"use client";

import { useEffect, useState } from "react";
import Connexion from "../components/Connexion";
import { useAuth } from "../providers/AuthProvider";
import NewGameArea from "./components/NewGameArea";

export default function GamePage() {
  const [availableTeams, setAvailableTeams] = useState([]);
  const { isConnected } = useAuth();

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await fetch("https://node-wolvesville.onrender.com" + "/api/teams");
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

  return (
    <>
      {isConnected ? (
        <NewGameArea teams={availableTeams} />
      ) : (
        <Connexion />
      )}
    </>
  )
};
