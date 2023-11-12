"use client";

import { useState } from "react";
import AvatarUI from "./AvatarUI";

const ProfileCard = () => {
  const [playerUserName, setPlayerUserName] = useState("");
  const [playerAvatar, setPlayerAvatar] = useState("");

  const handleNameSubmit = () => {
    // You can add functionality here to handle the name submission
  };

  return (
    <div className="m-24 max-w-sm mx-auto bg-slate-700 rounded-xl overflow-hidden shadow-lg">
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2">Edit Your Profile</div>
        <p className="text-gray-700 text-base">Welcome, {playerUserName || "Guest"}!</p>
        <AvatarUI />
      </div>
      <div className="px-6 py-4">
        <label>Username</label>
        <input
          type="text"
          className="w-full my-2 py-2 px-3 border rounded-md"
          placeholder="Enter your username"
          value={playerUserName}
          onChange={(e) => setPlayerUserName(e.target.value)}
        />
        <label>Avatar</label>
        <input
          type="file"
          className="w-full my-2 py-2 px-3 border rounded-md"
          placeholder="Upload your avatar"
          value={playerAvatar}
          onChange={(e) => setPlayerAvatar(e.target.value)}
        />
        <button
          className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleNameSubmit}>
          Submit
        </button>
      </div>
    </div>
  );
};

export default ProfileCard;
