import { nextui } from "@nextui-org/react";

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  darkMode: "class",
  plugins: [
    nextui({
      themes: {
        light: {
          colors: {
            primary: {
              foreground: "#fbfb23",
              DEFAULT: "#e50403",
            },
            secondary: {
              foreground: "#fff",
              DEFAULT: "#52525B",
            },
            background: "#101010",
          },
        },
        dark: {
          colors: {
            primary: {
              foreground: "#fbfb23",
              DEFAULT: "#e50403",
            },
            secondary: {
              foreground: "#fff",
              DEFAULT: "#52525B",
            },
            background: "#101010",
          },
        },
      },
    }),
  ],
};
