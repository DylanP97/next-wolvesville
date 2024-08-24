"use client";

import NavigationMenu from "./NavigationMenu";
import AuthInfo from "./AuthInfo";
import RolesCarousel from "./RolesCarousel";

const HomePage = ({ username, isInRoom, avatar }) => {
  return (
    <div className="object-contain overflow-hidden flex flex-col justify-between flex-grow">
      <AuthInfo
        username={username}
        // socketId={socketId}
        isInRoom={isInRoom}
        avatar={avatar}
      />
      <RolesCarousel />
      <NavigationMenu />
    </div>
  );
};

export default HomePage;
