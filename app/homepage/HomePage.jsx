"use client";

import NavigationMenu from "./NavigationMenu";
import AuthInfo from "./AuthInfo";
import { useAuth } from "../providers/AuthProvider";
import RolesCarousel from "./RolesCarousel";
import MedievalVillageDaytimeBackground from "../game/Backgrounds/MedievalVillageDaytimeBackground";
import { useEffect } from "react";
import TrackDisplay from "../general-btns/TrackDisplay";
import TipsRotator from "./TipsRotator";

const HomePage = ({ username, isPlaying, isInRoom, avatar }) => {

  // !room.isLaunched && usersInTheRoom.length < room.nbrOfPlayers && !usersInTheRoom.some((usr) => usr.username === username)

  // the user shouldn't be in the homepage if is playing so this delete his game state to prevent errors

  return (
    <div className="object-contain overflow-hidden flex flex-col justify-between flex-grow">
      {/* <MedievalVillageDaytimeBackground /> */}
      <AuthInfo username={username} isInRoom={isInRoom} isPlaying={isPlaying} avatar={avatar} />
      <RolesCarousel />
      <NavigationMenu />
      <TipsRotator />
    </div>
  );
};

HomePage.displayName = "HomePage"; // Move it here, after the component definition

export default HomePage;