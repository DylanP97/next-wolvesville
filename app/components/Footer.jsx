"use client";

import { Tooltip } from "@nextui-org/react";
import Link from "next/link";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-black p-4 w-full">
      <Tooltip content={t("check.repo")} color="primary" variant="flat">
        <Link
          href="https://github.com/DylanP97?tab=repositories"
          color="foreground"
          className="text-sm text-white text-xs hover:underline" 
        >
          {t("coded.by")}
        </Link>
      </Tooltip>
    </footer>
  );
};

export default Footer;
