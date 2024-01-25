"use client";

import { Button, Card, CardBody, CardHeader, Divider } from "@nextui-org/react";
import { useAuth } from "../../providers/AuthProvider";

const ConnectedUsers = () => {
  const { connectedUsers } = useAuth();

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
            <Card key={index} className="m-4">
              <CardBody>
                <p>User Id: {user.socketId}</p>
                <p>User name: {user.username}</p>
                {
                  user.isInARoom && <p>Is in a Room: {user.isInARoom}</p>
                }
              </CardBody>
            </Card>
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
