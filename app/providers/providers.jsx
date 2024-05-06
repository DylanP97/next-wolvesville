"use client";

import { NextUIProvider } from "@nextui-org/react";
import { AuthProvider } from "./AuthProvider";
import { I18nextProvider } from "react-i18next";
import i18n from "../lib/i18n";

export function Providers({ children }) {
  return (
    <I18nextProvider i18n={i18n}>
      <NextUIProvider>
        <AuthProvider>{children}</AuthProvider>
      </NextUIProvider>
    </I18nextProvider>
  );
}
