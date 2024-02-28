"use client";

import { Button } from "@nextui-org/react";
import { useAuth } from "../providers/AuthProvider";
import AvatarUI from "../profile/Profile/AvatarUI";

const ConnectedUsers = () => {
  const { connectedUsers } = useAuth();

  return (
    <div className="h-screen h-full w-full bg-black p-4">
      <h1 className="text-white text-3xl font-bold mb-6 mt-10">Connected Users List</h1>
      {!connectedUsers ? (
        <div className="m-4">
          <p className="text-white">There are no users connected currently</p>
        </div>
      ) : (
        connectedUsers.map((user, index) => {
          return (
            <div
              key={"usercard" + index}
              className="flex flex-row bg-white p-4 m-2 rounded-3xl hover:opacity-90 cursor-pointer"
            >
              <div className="flex justify-center items-center p-1">
                <AvatarUI heightAndWidth={50} accessories={user.avatar.accessories} accessoriesColor={user.avatar.accessoriesColor} clothesColor={user.avatar.clothesColor} clothing={user.avatar.clothing} clothingGraphic={user.avatar.clothingGraphic} eyebrows={user.avatar.eyebrows} eyes={user.avatar.eyes} facialHair={user.avatar.facialHair}
                  facialHairColor={user.avatar.facialHairColor} hairColor={user.avatar.hairColor} hatColor={user.avatar.hatColor} mouth={user.avatar.mouth} size={user.avatar.size} skinColor={user.avatar.skinColor} top={user.avatar.top} />
              </div>
              <div>
                <p className="text-md text-gray-800">{user.username}</p>
                <p className="text-xs text-gray-800">id: {user.socketId}</p>
                {
                  user.isInRoom ? (
                    <p className="text-xs text-gray-800">🟢 Is in a Room: {user.isInRoom}</p>) : (<p className="text-xs text-gray-800">🔴 Not in a room currently!</p>
                  )
                }
              </div>
            </div>
          );
        })
      )}
      <br />
      <Button className="mt-6" color="secondary" variant="ghost" onClick={() => window.history.back()}>
        Go Back
      </Button>
    </div>
  );
};

export default ConnectedUsers;
