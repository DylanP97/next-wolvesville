"use client";

import { Button } from "@nextui-org/react";

const GeneralBtns = () => {
  return (
    <div className="flex flex-row justify-end items-center w-full border-b-0 border-white bg-black p-2 z-30 h-[10%]">
      {/* <Button
        variant="shadow"
        color="default"
        aria-label="GoBack"
        className="mx-2 text-white"
        onClick={() => window.history.back()}
      >
        Go Back
      </Button> */}
      <Button
        variant="shadow"
        color="secondary"
        aria-label="Logout"
        onPress={() => document.location.assign("/")}
      >
        Logout
      </Button>
    </div>
  );
};

export default GeneralBtns;
