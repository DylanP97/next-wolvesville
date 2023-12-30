"use client";

const AppHeader = ({ username, socketId }) => {
  return (
    <header className="p-2">
      <p className="text-white">Username: {username}</p>
      <p className="text-white">SocketId: {socketId}</p>
    </header>
  );
};

export default AppHeader;
