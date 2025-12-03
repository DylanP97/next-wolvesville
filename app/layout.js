// layout.js
import "./globals.css";
import { Providers } from "./providers/providers";
import Footer from "./components/Footer";
import { RenderProvider } from "./providers/RenderProvider";
import DevModeBorder from "./components/DevModeBorder";
import GeneralBtns from "./general-btns/GeneralBtns";
import { Creepster } from "next/font/google";
import ClientOnly from "./components/ClientOnly";

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
    <html lang="fr" className={creepster.variable}>
      <body>
        <ClientOnly>
          <Providers>
            <DevModeBorder>
              <RenderProvider>
                <div className="flex flex-col justify-between w-full h-[100vh]">
                  <GeneralBtns />
                  {children}
                  {/* <Footer /> */}
                </div>
              </RenderProvider>
            </DevModeBorder>
          </Providers>
        </ClientOnly>
      </body>
    </html>
  );
}