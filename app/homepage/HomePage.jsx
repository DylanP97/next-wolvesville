"use client";

import NavigationMenu from "./NavigationMenu";
import AuthInfo from "./AuthInfo";
import RolesCarousel from "./RolesCarousel";

const HomePage = ({ username, isInRoom, avatar, setActiveComponent }) => {
  return (
    <div className="object-contain overflow-hidden flex flex-col justify-between flex-grow">
      <AuthInfo
        username={username}
        isInRoom={isInRoom}
        avatar={avatar}
      />
      <RolesCarousel />
      <NavigationMenu setActiveComponent={setActiveComponent} />
    </div>
  );
};

export default HomePage;
