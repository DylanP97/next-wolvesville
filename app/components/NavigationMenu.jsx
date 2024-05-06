"use client";

import Link from "next/link";

const NavigationMenu = () => {
  const paths = [
    { label: "Join Room", path: "/join-room" },
    { label: "Create Room", path: "/create-room" },
    { label: "Connected Users", path: "/connected-users" },
    { label: "View Roles", path: "/roles" },
    { label: "Edit Profile", path: "/profile" },
  ];

  return (
    <nav className="flex flex-col items-center py-4 w-full z-20">
      <h1 className="text-3xl font-bold my-6 text-white text-center">
        Main Menu
      </h1>
      {paths.map((p, index) => (
        <Link
          key={index + "navlink"}
          className="w-40 z-20 p-2 m-2 rounded-xl text-primary text-sm text-center hover:text-black hover:bg-primary border-2 border-primary"
          href={p.path}
          color="foreground"
        >
          {p.label}
        </Link>
      ))}
    </nav>
  );
};

export default NavigationMenu;
