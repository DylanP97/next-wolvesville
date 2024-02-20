"use client";

import { Button, Card, CardBody, CardHeader, Divider, Link, User } from "@nextui-org/react";
import { useAuth } from "../providers/AuthProvider";
import { Avatar } from "@nextui-org/react";

const ConnectedUsers = () => {
  const { connectedUsers, avatar } = useAuth();
  console.log(avatar)

  return (
    <div className="min-h-screen h-full w-full bg-black p-4">
      <h1 className="text-white text-3xl font-bold mb-6">Connected Users List</h1>
      {!connectedUsers ? (
        <div className="m-4">
          <p className="text-white">There are no users connected currently</p>
        </div>
      ) : (
        connectedUsers.map((user, index) => {
          return (
            <User
              className="bg-white p-4"
              name={user.username}
              description={(
                <>
                  <p>{user.socketId}</p>
                  {user.isInARoom && <p>Is in a Room: {user.isInARoom}</p>}
                </>
              )}
              avatarProps={{
                src: ""
              }}
            />
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
