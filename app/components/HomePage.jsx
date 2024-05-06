"use client";

import NavigationMenu from "./NavigationMenu";
import AuthInfo from "./AuthInfo";

const HomePage = ({ username, socketId, isInRoom, avatar }) => {
  return (
    <div className="w-screen h-full p-4 object-contain overflow-hidden h-[90%]">
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
