"use client";

import NavigationMenu from "./NavigationMenu";
import { useSocket } from "../../providers/SocketContext";

const HomePage = () => {
  const { socket, socketId } = useSocket();

  return (
    <div className="flex flex-col items-center p-20 w-screen h-screen">
      <h1 className="text-4xl font-bold my-6 text-white">Wolvesville</h1>
      <p className="text-white">Welcome to my own version of Wolvesville!</p>
      <a target="_blank" className="text-white hover:text-blue-400" href="https://www.wolvesville.com">
        Check the original game here
      </a>
      <p className="text-white">Your Socket Session ID: {socketId}</p>
      <NavigationMenu />
    </div>
  );
};

export default HomePage;
