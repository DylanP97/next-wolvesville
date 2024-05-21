import "./globals.css";
import { GeistSans } from "geist/font";
import { Providers } from "./providers/providers";
import GeneralBtns from "./components/GeneralBtns";
import Footer from "./components/Footer";

export const metadata = {
  title: "Werewolves",
  description:
    "Welcome to Wolvesville, an exhilarating journey back to the dark and mysterious town of Wolvesville. In this highly anticipated sequel, you'll find yourself immersed in a world of deceit, strategy, and hidden identities. This time, it's not just about survival; it's about rewriting the history of Wolvesville.",
  icons: {
    icon: "./favicon2.io"
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${GeistSans.className} `}>
      <body>
        <Providers>
          <div className="min-h-screen flex flex-col justify-between w-full">
            <GeneralBtns />
            {children}
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
