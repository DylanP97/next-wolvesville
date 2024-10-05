// layout.js
import "./globals.css";
import { Providers } from "./providers/providers";
import GeneralBtns from "./general-btns/GeneralBtns";
import Footer from "./components/Footer";
import TrackDisplay from "./TrackDisplay";
import { RenderProvider } from "./providers/RenderProvider";

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
    <html lang="en" className={``}>
      <body>
        <Providers>
          <div className="flex flex-col justify-between w-full h-full">
            {/* <GeneralBtns /> */}
            <RenderProvider>{children}</RenderProvider>
            {/* <Footer /> */}
            <TrackDisplay />
          </div>
        </Providers>
      </body>
    </html>
  );
}
