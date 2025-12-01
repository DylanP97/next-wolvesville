"use client";

import AvatarUI from "./components/AvatarUI";
import IsInRoomInfo from "./components/IsInRoomInfo";

const ConnectedUserCard = ({ user }) => {

  console.log(user.isPlaying, user.username)

  // Determine the background color based on isPlaying and isInRoom
  const getBgColor = () => {
    if (user.isPlaying && user.isInRoom) return "bg-green-500";
    if (!user.isPlaying && user.isInRoom) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div
      className={`${getBgColor()} flex flex-row p-2 m-2 h-fit rounded-3xl hover:opacity-90 cursor-pointer max-w-[350px]`}
    >
      <AvatarUI heightAndWidth={60} avatar={user.avatar} />
      <div className="flex flex-col items-start flex-1">
        <p className="text-md">{user.username}</p>
        <IsInRoomInfo isInRoom={user.isInRoom} isPlaying={user.isPlaying} />
      </div>
    </div>
  );
};

export default ConnectedUserCard;
