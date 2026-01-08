"use client";

import NavigationMenu from "./NavigationMenu";
import AuthInfo from "./AuthInfo";
import RolesCarousel from "./RolesCarousel";
import WerewolfBackground from "../WerewolfBackground";
// import graveRobberVid from "../../public/

const HomePage = ({ username, isPlaying, isInRoom, avatar }) => {

  // !room.isLaunched && usersInTheRoom.length < room.nbrOfPlayers && !usersInTheRoom.some((usr) => usr.username === username)
  // the user shouldn't be in the homepage if is playing so this delete his game state to prevent errors

  return (
    <div className="object-contain overflow-hidden flex flex-col justify-between flex-grow">
      {/* <MedievalVillageDaytimeBackground /> */}
      {/* <video
        className="absolute inset-0 h-full object-cover z-10"
        src="animations/grave_robber.mp4"
        autoPlay
        loop
        muted
        playsInline
      /> */}
      <AuthInfo username={username} isInRoom={isInRoom} isPlaying={isPlaying} avatar={avatar} />
      <RolesCarousel />
      <NavigationMenu />
      <WerewolfBackground />
      {/* Background video */}
    </div>
  );
};

HomePage.displayName = "HomePage"; // Move it here, after the component definition

export default HomePage;