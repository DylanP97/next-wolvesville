"use client";

import AvatarUI from "../profile/components/AvatarUI";

const NotConnectedUserCard = ({ user }) => {
  return (
    <div
      className={`bg-cyan-800 flex flex-row justify-start items-center gap-2 p-2 m-2 max-w-[350px] min-w-[200px] rounded-3xl hover:opacity-90 cursor-pointer`}
    >
      <AvatarUI heightAndWidth={50} avatar={user.avatar} />
      <p className="text-sm">{user.username}</p>
    </div>
  );
};

export default NotConnectedUserCard;
