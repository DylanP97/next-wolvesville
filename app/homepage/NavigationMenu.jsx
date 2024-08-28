"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useAuth } from "../providers/AuthProvider";

const NavigationMenu = () =>
  // {paths}
  {
    const { t } = useTranslation();
    const { isGuest } = useAuth();

    const paths = [
      { label: t("menu.2"), path: "/create-room", allowedForGuest: true },
      { label: t("menu.1"), path: "/join-room", allowedForGuest: true },
      { label: t("menu.3"), path: "/connected-users", allowedForGuest: true },
      { label: t("menu.4"), path: "/roles", allowedForGuest: true },
      {
        label: t("menu.5"),
        path: "/profile",
        allowedForGuest: false,
      },
    ];

    // Filter paths based on isGuest status
    const filteredPaths = paths.filter((p) =>
      isGuest ? p.allowedForGuest : true
    );

    return (
      <nav className="absolute top-1/3 flex flex-col items-center py-4 w-full z-20">
        {filteredPaths.map((p, index) => (
          <Link
            key={index + "-navlink"}
            className={`w-60 h-10 z-20 p-2 my-2 rounded-3xl bg-primary text-sm text-center text-primary-foreground flex justify-center items-center hover:font-bold hover:scale-[105%] transition-all`}
            href={p.path}
          >
            {p.label}
          </Link>
        ))}
      </nav>
    );
  };

export default NavigationMenu;
