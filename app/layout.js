import "./globals.css";
import { GeistSans } from "geist/font";
import { Providers } from "./providers/providers";

export const metadata = {
  title: "Wolvesville",
  description:
    "Welcome to Wolvesville, an exhilarating journey back to the dark and mysterious town of Wolvesville. In this highly anticipated sequel, you'll find yourself immersed in a world of deceit, strategy, and hidden identities. This time, it's not just about survival; it's about rewriting the history of Wolvesville.",
  icons: {
    icon: "./favicon.ico",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={GeistSans.className}>
      <Providers>
        <body className="flex flex-col items-center w-screen min-h-screen h-full">
          {children}
        </body>
      </Providers>
    </html>
  );
}
