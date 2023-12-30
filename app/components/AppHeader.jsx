"use client";

const AppHeader = ({ username }) => {
  return (
    <header className="p-2">
      <p className="text-white">Username: {username}</p>
    </header>
  );
};

export default AppHeader;
