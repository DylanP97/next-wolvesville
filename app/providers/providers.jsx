"use client";

import { I18nextProvider } from "react-i18next";
import { NextUIProvider } from "@nextui-org/react";
import { KeysProvider } from "./KeysProvider";
import { SoundProvider } from "./SoundProvider";
import { AnimationProvider } from "./AnimationProvider";
import { AuthProvider } from "./AuthProvider";
import { DevModeProvider } from "./DevModeProvider";
import i18n from "../lib/i18n";
// import ClientOnly from "../components/ClientOnly";

export function Providers({ children }) {
  return (
    // <ClientOnly>
    <I18nextProvider i18n={i18n}>
      <NextUIProvider>
        <DevModeProvider>
          <KeysProvider>
            <SoundProvider>
              <AnimationProvider>
                <AuthProvider>{children}</AuthProvider>
              </AnimationProvider>
            </SoundProvider>
          </KeysProvider>
        </DevModeProvider>
      </NextUIProvider>
    </I18nextProvider>
    // </ClientOnly>
  );
}
