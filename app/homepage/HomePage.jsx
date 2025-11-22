"use client";

import NavigationMenu from "./NavigationMenu";
import AuthInfo from "./AuthInfo";
import { useAuth } from "../providers/AuthProvider";
import RolesCarousel from "./RolesCarousel";
import MedievalVillageDaytimeBackground from "../MedievalVillageDaytimeBackground";
import { useEffect } from "react";

const HomePage = ({ username, isInRoom, avatar }) => {
  const { updateUserGameState } = useAuth();

  useEffect(() => {
    if (isInRoom) updateUserGameState(null, false, null)
  }, [])

  return (
    <div className="object-contain overflow-hidden flex flex-col justify-between flex-grow">
      <MedievalVillageDaytimeBackground />
      <AuthInfo username={username} isInRoom={isInRoom} avatar={avatar} />
      <RolesCarousel />
      <NavigationMenu />
    </div>
  );
};

HomePage.displayName = "HomePage"; // Move it here, after the component definition

export default HomePage;