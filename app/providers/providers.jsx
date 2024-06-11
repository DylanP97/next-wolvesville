"use client";

import { NextUIProvider } from "@nextui-org/react";
import { AuthProvider } from "./AuthProvider";
import { KeysProvider } from "./KeysProvider";
import { SoundProvider } from "./SoundProvider";
import { I18nextProvider } from "react-i18next";
import i18n from "../lib/i18n";
import ClientOnly from "../components/ClientOnly";

export function Providers({ children }) {
  return (
    <ClientOnly>
      <I18nextProvider i18n={i18n}>
        <NextUIProvider>
          <KeysProvider>
            <SoundProvider>
              <AuthProvider>{children}</AuthProvider>
            </SoundProvider>
          </KeysProvider>
        </NextUIProvider>
      </I18nextProvider>
    </ClientOnly>
  );
}
