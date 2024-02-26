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
    <nav className="flex flex-col py-10 w-full">
      {paths.map((p, index) => (
        <Link
          key={index + "navlink"}
          className="p-2 my-2 w-full text-white bg-slate-800 hover:bg-slate-900 hover:outline-double outline-red-800 rounded-xl text-center"
          href={p.path}
          color="foreground">
          {p.label}
        </Link>
      ))
      }
    </nav>
  );
};

export default NavigationMenu;