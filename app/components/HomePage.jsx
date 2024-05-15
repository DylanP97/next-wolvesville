"use client";

import NavigationMenu from "./NavigationMenu";
import AuthInfo from "./AuthInfo";

const HomePage = ({ username, socketId, isInRoom, avatar }) => {
  return (
    <div className="object-contain overflow-hidden">
      <AuthInfo
        username={username}
        socketId={socketId}
        isInRoom={isInRoom}
        avatar={avatar}
      />
      <NavigationMenu />
    </div>
  );
};

export default HomePage;
