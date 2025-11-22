"use client";

import { useAuth } from "../providers/AuthProvider";
import { useDevMode } from "../providers/DevModeProvider";

const DevModeBorder = ({ children }) => {
  const { isDevMode } = useDevMode();
  const { isDev } = useAuth();


  return (
    <div className="relative w-full h-full">
      {isDevMode && isDev && (
        <div
          className="fixed inset-0 pointer-events-none z-50 border-8 border-yellow-500 border-dashed"
          style={{ boxSizing: "border-box" }}
        />
      )}
      {children}
    </div>
  );
};

export default DevModeBorder;

