"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";

const NavigationMenu = () => {
  const { t } = useTranslation();

  const paths = [
    { label: t("menu.1"), path: "/join-room" },
    { label: t("menu.2"), path: "/create-room" },
    { label: t("menu.3"), path: "/connected-users" },
    { label: t("menu.4"), path: "/roles" },
    { label: t("menu.5"), path: "/profile" },
  ];

  return (
    <nav className="flex flex-col items-center py-4 w-full z-20">
      {paths.map((p, index) => (
        <Link
          key={index + "navlink"}
          className={`w-60 z-20 p-2 my-2 rounded-xl bg-secondary text-white text-sm text-center hover:text-black hover:bg-primary hover:text-white ${
            index < 2 ? "animate-pulse" : ""
          } hover:scale-[105%] transition-all`}
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
