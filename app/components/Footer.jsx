"use client";

import { Tooltip } from "@nextui-org/react";
import Link from "next/link";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();

  return (
    <div className="relative w-full">
      <div className="fixed bottom-0 w-full h-10 group">
        <footer className="fixed bottom-0 w-full bg-black p-4 z-10 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <Tooltip content={t("check.repo")} color="primary" variant="flat">
            <Link
              href="https://github.com/DylanP97?tab=repositories"
              className="inline-block text-xs text-white"
            >
              {t("coded.by")}
            </Link>
          </Tooltip>
        </footer>
      </div>
    </div>
  );
};

export default Footer;
