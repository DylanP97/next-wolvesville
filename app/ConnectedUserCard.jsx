"use client";

import AvatarUI from "./components/AvatarUI";
import IsInRoomInfo from "./components/IsInRoomInfo";

const ConnectedUserCard = ({ user }) => {
  return (
    <div
      className={`${
        user.isInRoom ? "bg-green-500" : "bg-red-500"
      } flex flex-row p-2 m-2 h-fit rounded-3xl hover:opacity-90 cursor-pointer max-w-[350px]`}
    >
      <AvatarUI heightAndWidth={50} avatar={user.avatar} />
      <div className="flex flex-col items-start">
        <p className="text-md">{user.username}</p>
        <IsInRoomInfo isInRoom={user.isInRoom} />
      </div>
    </div>
  );
};

export default ConnectedUserCard;
