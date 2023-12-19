"use client";
import Link from "next/link";

const NavigationMenu = () => {
  return (
    <nav className="flex flex-col p-10 w-[400px]">
      <Link
        className="p-2 m-2 w-[90%] text-white bg-slate-800 hover:bg-slate-900 hover:outline-double outline-red-800 rounded-xl"
        href="/game"
        color="foreground">
        New Game
      </Link>
      <Link
        className="p-2 m-2 w-[90%] text-white bg-slate-800 hover:bg-slate-900 hover:outline-double outline-red-800 rounded-xl"
        href="/roles"
        color="foreground">
        Roles
      </Link>
      <Link
        className="p-2 m-2 w-[90%] text-white bg-slate-800 hover:bg-slate-900 hover:outline-double outline-red-800 rounded-xl"
        href="profile"
        color="foreground">
        Profile
      </Link>
      <Link
        className="p-2 m-2 w-[90%] text-white bg-slate-800 hover:bg-slate-900 hover:outline-double outline-red-800 rounded-xl"
        href="/about"
        color="foreground">
        About
      </Link>
    </nav>
  );
};

export default NavigationMenu;
