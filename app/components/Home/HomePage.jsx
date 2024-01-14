"use client";

import NavigationMenu from "./NavigationMenu";
import React, { useState } from "react";
import { Button } from "@nextui-org/react";

const HomePage = () => {

  return (
    <div>
      <h1 className="text-4xl font-bold my-6 text-white">Wolvesville</h1>
      <p className="text-white">Welcome to my own version of Wolvesville!</p>
      <a target="_blank" className="text-white hover:text-blue-400" href="https://www.wolvesville.com">
        Check the original game here
      </a>
      <NavigationMenu />
    </div>
  );
};

export default HomePage;
