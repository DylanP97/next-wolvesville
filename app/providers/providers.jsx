// app/providers/providers.js  (your current file, just add one line)
"use client";

import { I18nextProvider } from "react-i18next";
import { NextUIProvider } from "@nextui-org/react";
import { KeysProvider } from "./KeysProvider";
import { SoundProvider } from "./SoundProvider";
import { AnimationProvider } from "./AnimationProvider";
import { AuthProvider } from "./AuthProvider";
import { DevModeProvider } from "./DevModeProvider";
import { PreventBackProvider } from "./PreventBackProvider";   // ← NEW
import i18n from "../lib/i18n";

export function Providers({ children }) {
  return (
    <I18nextProvider i18n={i18n}>
      <NextUIProvider>
        <DevModeProvider>
          <KeysProvider>
            <SoundProvider>
              <AnimationProvider>
                <AuthProvider>
                  <PreventBackProvider>     {/* ← Wrap here */}
                    {children}
                  </PreventBackProvider>
                </AuthProvider>
              </AnimationProvider>
            </SoundProvider>
          </KeysProvider>
        </DevModeProvider>
      </NextUIProvider>
    </I18nextProvider>
  );
}