"use client";

import NavigationMenu from "./NavigationMenu";
import Image from "next/image";
import AvatarUI from "../profile/Profile/AvatarUI";

const HomePage = ({ username, socketId, isInRoom, avatar }) => {
  return (
    <div className="relative h-screen w-screen p-8 bg-gradient-to-br from-zinc-900 from-10% via-zinc-700 via-30% to-red-950 to-80% object-contain overflow-hidden">
      <header className="p-2 flex items-end">
        <div className="">
          <AvatarUI avatar={avatar} heightAndWidth={100} />
        </div>
        <div>
          <p className="text-sm text-white">Username: {username}</p>
          <p className="text-sm text-white">SocketId: {socketId}</p>
          {isInRoom ? (
            <p className="text-sm text-white">🟢 Is in a Room: {isInRoom}</p>
          ) : (
            <p className="text-sm text-white">🔴 Not in a room currently!</p>
          )}
        </div>
      </header>
      <h1 className="text-3xl font-bold my-2 text-white">Wolvesville</h1>
      <p className="text-white text-sm">
        Welcome to my own version of Wolvesville!
      </p>
      <a
        target="_blank"
        className="text-white text-sm hover:text-blue-400"
        href="https://www.wolvesville.com"
      >
        Check the original game here
      </a>
      <NavigationMenu />
      <Image
        height={1500}
        width={1500}
        src={
          "https://res.cloudinary.com/dnhq4fcyp/image/upload/v1710518131/Loup_de_lOmbre_qcjycz.webp"
        }
        alt="alphaWolf"
        className="absolute top-[-10%] right-[-25%] opacity-30"
      />
    </div>
  );
};

export default HomePage;
