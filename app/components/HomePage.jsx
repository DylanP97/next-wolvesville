"use client";

import NavigationMenu from "./NavigationMenu";
import React from "react";

const HomePage = ({ username, socketId, isInRoom }) => {

  return (
    <div className="h-screen pt-8">
      <header className="p-2">
        <p className="text-white">Username: {username}</p>
        <p className="text-white">SocketId: {socketId}</p>
        {
          isInRoom ? (
            <p className="text-white">🟢 Is in a Room: {isInRoom}</p>) : (<p className="text-white">🔴 Not in a room currently!</p>
          )
        }
      </header>
      <h1 className="text-4xl font-bold my-6 text-white">Wolvesville</h1>
      <p className="text-white">Welcome to my own version of Wolvesville!</p>
      <a target="_blank" className="text-white hover:text-blue-400" href="https://www.wolvesville.com">
        Check the original game here
      </a>
      <NavigationMenu />
    </div>
  );
};

export default HomePage;
