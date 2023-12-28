"use client";

import { Button, Divider } from "@nextui-org/react";
import React from "react";

const JoinRoom = ({ currentRooms }) => {
  const joinRoom = () => {
    if (room !== "") {
      socket.emit("join_room", room);
    }
  };

  return (
    <div className="min-h-screen h-full w-full bg-black p-4">
      <h1 className="text-white text-3xl font-bold">Join a room</h1>
      {!currentRooms ? (
        <div className="m-4">
          <p className="text-white">There are no rooms to join currently</p>
        </div>
      ) : (
        currentRooms.map((room) => {
          return (
            <div className="m-4" key={room.id}>
              <p>{room.id}</p>
              <Button color="secondary" variant="ghost" onClick={() => joinRoom(room.id)}>
                Join Room
              </Button>
            </div>
          );
        })
      )}
      <Button color="secondary" variant="ghost" onClick={() => window.history.back()}>
        Go Back
      </Button>
    </div>
  );
};

export default JoinRoom;
