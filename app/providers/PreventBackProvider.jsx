// app/providers/PreventBackProvider.jsx
"use client";

import { useEffect } from "react";

export function PreventBackProvider({ children }) {
  useEffect(() => {
    const handleBack = () => {
      const leave = confirm(
        "Tu vas quitter la partie !\nEs-tu sûr de vouloir partir ?"
      );

      if (!leave) {
        // Stay on the page
        window.history.pushState(null, "", window.location.href);
      }
      // If user clicks OK → browser goes back normally
    };

    // Add one dummy history entry
    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", handleBack);

    return () => {
      window.removeEventListener("popstate", handleBack);
    };
  }, []);

  return <>{children}</>;
}