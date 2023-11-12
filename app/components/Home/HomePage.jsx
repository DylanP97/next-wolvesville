"use client";

import NavigationMenu from "./NavigationMenu";

const HomePage = () => {

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-4xl font-bold my-6">Welcome to Wolvesville 🐺</h1>
      <p>
        Welcome to my own version of the game{" "}
        <a
          target="_blank"
          className="hover:text-blue-400"
          href="https://www.wolvesville.com">
          Wolvesville
        </a>
      </p>
      <NavigationMenu />
    </div>
  );
};

export default HomePage;
