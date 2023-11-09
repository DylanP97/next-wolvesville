import { GeistSans, GeistMono } from "geist/font";
import "./globals.css";

export const metadata = {
  title: "Wolvesville revisited",
  description:
    "Welcome to Wolvesville Revisited, an exhilarating journey back to the dark and mysterious town of Wolvesville. In this highly anticipated sequel, you'll find yourself immersed in a world of deceit, strategy, and hidden identities. This time, it's not just about survival; it's about rewriting the history of Wolvesville.",
  icons: {
    icon: "./favicon.ico",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={GeistSans.className}>
      <body>
        <main className="flex h-screen w-screen flex-col items-center">
          {children}
        </main>
      </body>
    </html>
  );
}
