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
    <nav className="flex flex-col items-center py-6 w-full z-20">
      {paths.map((p, index) => (
        <Link
          key={index + "navlink"}
          className="w-fit z-20 py-2 text-white text-center link-underline link-underline-black text-black"
          href={p.path}
          color="foreground"
        >
          {p.label}
        </Link>
      ))
      }
    </nav>
  );
};

export default NavigationMenu;