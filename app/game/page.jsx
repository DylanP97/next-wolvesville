"use client";

import { useEffect, useState } from "react";
import Connexion from "../components/Connexion";
import { useAuth } from "../providers/AuthProvider";
import NewGameArea from "./components/NewGameArea";
import { KeysProvider } from "../providers/KeysProvider";

export default function GamePage() {
  const [availableTeams, setAvailableTeams] = useState([]);
  const { isConnected } = useAuth();

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await fetch(process.env.NEXT_PUBLIC_API_URL + "/api/teams");
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
        <KeysProvider>
          <NewGameArea teams={availableTeams} />
        </KeysProvider>
      ) : (
        <Connexion />
      )}
    </>
  )
};
