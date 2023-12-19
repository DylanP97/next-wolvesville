"use client";

import NavigationMenu from "./NavigationMenu";

const HomePage = () => {
  return (
    <div className="flex flex-col items-center p-20 w-screen h-screen">
      <h1 className="text-4xl font-bold my-6 text-white">Wolvesville revisited</h1>
      <p className="text-white">Welcome to my own version of Wolvesville!</p>
      <a target="_blank" className="text-white hover:text-blue-400" href="https://www.wolvesville.com">
        Check the original game here
      </a>
      <NavigationMenu />
    </div>
  );
};

export default HomePage;
