"use client";

import NavigationMenu from "./NavigationMenu";
import AuthInfo from "./AuthInfo";
import RolesCarousel from "./RolesCarousel";
import MedievalVillageDaytimeBackground from "../MedievalVillageDaytimeBackground";

const HomePage = ({ username, isInRoom, avatar }) => {
  return (
    <div className="object-contain overflow-hidden flex flex-col justify-between flex-grow">
      <MedievalVillageDaytimeBackground />
      <AuthInfo username={username} isInRoom={isInRoom} avatar={avatar} />
      <RolesCarousel />
      <NavigationMenu />
    </div>
  );
};

export default HomePage;
