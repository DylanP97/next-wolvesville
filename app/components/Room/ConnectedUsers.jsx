"use client";

import { Button } from "@nextui-org/react";

const ConnectedUsers = ({ connectedUsers }) => {
  return (
    <div className="min-h-screen h-full w-full bg-black p-4">
      <h1 className="text-white text-3xl font-bold">Connected Users List</h1>
      {!connectedUsers ? (
        <div className="m-4">
          <p className="text-white">There are no users connected currently</p>
        </div>
      ) : (
        connectedUsers.map((user, index) => {
          return (
            <p key={index} className="text-xs text-white">
              {user.name}
            </p>
          );
        })
      )}
      <Button color="secondary" variant="ghost" onClick={() => window.history.back()}>
        Go Back
      </Button>
    </div>
  );
};

export default ConnectedUsers;
