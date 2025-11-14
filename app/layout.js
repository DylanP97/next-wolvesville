// layout.js
import "./globals.css";
import { Providers } from "./providers/providers";
import GeneralBtns from "./general-btns/GeneralBtns";
import Footer from "./components/Footer";
import TrackDisplay from "./TrackDisplay";
import { RenderProvider } from "./providers/RenderProvider";
import DevModeBorder from "./components/DevModeBorder";
import { Creepster } from "next/font/google";

const creepster = Creepster({
  weight: "400",
  subsets: ["latin"], // remove "latin-ext"
  display: "swap",
  variable: "--font-creepster",
});

export const metadata = {
  title: "Werewolves",
  description:
    "Welcome to Wolvesville, an exhilarating journey back to the dark and mysterious town of Wolvesville. In this highly anticipated sequel, you'll find yourself immersed in a world of deceit, strategy, and hidden identities. This time, it's not just about survival; it's about rewriting the history of Wolvesville.",
  icons: {
    icon: "./favicon.ico",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr"
    // {i18n.language ? i18n.language : "en"} 
    className={creepster.variable}>
      <body>
        <Providers>
          <DevModeBorder>
            <div className="flex flex-col justify-between w-full h-[100vh] pt-[72px]">
              <GeneralBtns />
              <RenderProvider>{children}</RenderProvider>
              {/* <Footer /> */}
              <TrackDisplay />
            </div>
          </DevModeBorder>
        </Providers>
      </body>
    </html>
  );
}
