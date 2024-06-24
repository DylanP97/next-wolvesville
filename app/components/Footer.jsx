"use client";

import { Tooltip } from "@nextui-org/react";
import Link from "next/link";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="sticky bottom-0 w-full bg-black p-4 z-10 border-white border-t-2">
      <Tooltip content={t("check.repo")} color="primary" variant="flat">
        <Link
          href="https://github.com/DylanP97?tab=repositories"
          className="inline-block text-xs text-white"
        >
          {t("coded.by")}
        </Link>
      </Tooltip>
    </footer>
  );
};

export default Footer;
