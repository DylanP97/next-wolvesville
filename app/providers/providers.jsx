"use client";
import { NextUIProvider } from "@nextui-org/react";
import { AuthProvider } from "./AuthProvider";
import { KeysProvider } from "./KeysProvider";

export function Providers({ children }) {
  return (
    <NextUIProvider>
      <KeysProvider>
        <AuthProvider>
          {children}
        </AuthProvider>
      </KeysProvider>
    </NextUIProvider>
  );
}
