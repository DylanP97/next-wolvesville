"use client";
import { NextUIProvider } from "@nextui-org/react";
import { AuthProvider } from "./AuthProvider";
import { RoomProvider } from "./RoomProvider";

export function Providers({ children }) {
  return (
    <NextUIProvider>
      <AuthProvider>
        {/* <RoomProvider> */}
          {children}
        {/* </RoomProvider> */}
      </AuthProvider>
    </NextUIProvider>
  );
}
