"use client";

import Link from "next/link";

const NavigationMenu = () => {

  const paths = [
    { label: "Join Room", path: "/join-room" },
    { label: "Create Room", path: "/create-room" },
    { label: "Connected Users", path: "/connected-users" },
    { label: "Roles", path: "/roles" },
    { label: "Edit Profile", path: "/profile" },
  ];

  return (
    <nav className="flex flex-col items-center py-10 w-full z-20">
      {paths.map((p, index) => (
        <Link
          key={index + "navlink"}
          className="max-w-[300px] w-full z-20 p-2 my-2 w-full text-white hover:underline rounded-xl text-center link link-underline link-underline-black text-black"
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