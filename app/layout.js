// app/layout.js
import "./globals.css";
import { Providers } from "./providers/providers";
import { RenderProvider } from "./providers/RenderProvider";
import DevModeBorder from "./components/DevModeBorder";
import GeneralBtns from "./general-btns/GeneralBtns";
import { Creepster } from "next/font/google";
import ClientOnly from "./components/ClientOnly";
import { cookies } from "next/headers";        // ← only new import

const creepster = Creepster({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-creepster",
});

// Translations directly here – no extra files needed
const translations = {
  fr: {
    title: "Jeu du Loup-Garou - DylanP97",
    description:
      "Jouez au célèbre jeu du Loup-Garou en ligne avec vos amis ! Rejoignez des parties passionnantes, incarnez différents rôles et utilisez la stratégie pour survivre et gagner. Que vous soyez un villageois, un loup-garou ou un autre personnage intrigant, chaque partie est une nouvelle aventure pleine de suspense et de surprises. Préparez-vous à des nuits de mystère et des jours de débats animés dans ce jeu captivant. Awo awo je suis un loup-garou MDR !",
  },
  en: {
    title: "Werewolf Online - DylanP97",
    description:
      "Play the famous Werewolf game online with your friends! Join thrilling games, take on different roles and use strategy to survive and win. Whether you're a villager, a werewolf, or another mysterious character, every game is a new adventure full of suspense and surprises. Get ready for nights of mystery and days of heated debate in this addictive game. Awoooo I'm a werewolf LOL!",
  },
  // Add es, de, it, etc. later exactly the same way if you want
};

// This runs on the server → reads the i18next cookie and returns the right metadata
export async function generateMetadata() {
  const cookieStore = cookies();
  const lang = cookieStore.get("i18next")?.value || "fr"; // default = French

  const t = translations[lang] || translations.fr; // fallback to French

  return {
    title: t.title,
    description: t.description,
    icons: {
      icon: "./favicon.ico",
    },
  };
}

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
                </div>
              </RenderProvider>
            </DevModeBorder>
          </Providers>
        </ClientOnly>
      </body>
    </html>
  );
}