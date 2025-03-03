"use client";

import { I18nextProvider } from "react-i18next";
import { NextUIProvider } from "@nextui-org/react";
import { KeysProvider } from "./KeysProvider";
import { SoundProvider } from "./SoundProvider";
import { AnimationProvider } from "./AnimationProvider";
import { AuthProvider } from "./AuthProvider";
import i18n from "../lib/i18n";
// import ClientOnly from "../components/ClientOnly";

export function Providers({ children }) {
  return (
    // <ClientOnly>
    <I18nextProvider i18n={i18n}>
      <NextUIProvider>
        <KeysProvider>
          <SoundProvider>
            <AnimationProvider>
              <AuthProvider>{children}</AuthProvider>
            </AnimationProvider>
          </SoundProvider>
        </KeysProvider>
      </NextUIProvider>
    </I18nextProvider>
    // </ClientOnly>
  );
}
