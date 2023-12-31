"use client";

import { Button, Divider } from "@nextui-org/react";
import { useState } from "react";

const CreateRoom = () => {
  const [roomName, setRoomName] = useState("");

  const submitNewRoom = (roomName) => {
    console.log("create room " + roomName);
  };

  return (
    <div className="w-full bg-black p-4">
      <h1 className="text-white text-3xl font-bold">Create a new room</h1>
      <div className="m-4">
        <label className="text-white">Enter room name : </label>
        <input type="text" name="roomName" onChange={(e) => setRoomName(e.target.value)} />
        <Divider className="my-2" />
        <Button color="secondary" variant="ghost" onClick={() => submitNewRoom(roomName)}>
          Create Room
        </Button>
      </div>
      <Button color="primary" variant="ghost" onClick={() => window.history.back()}>
        Go Back
      </Button>
    </div>
  );
};

export default CreateRoom;
