"use client";

import { Button } from "@nextui-org/react";

const GeneralBtns = () => {
  return (
    <div className="absolute top-4 right-4 z-30">
      <Button
        variant="shadow"
        color="danger"
        aria-label="Disconnect"
        onPress={() => document.location.assign("/")}
      >
        Logout
      </Button>
      <Button
        variant="shadow"
        color="secondary"
        aria-label="GoBack"
        className="mx-2"
        onClick={() => window.history.back()}
      >
        Go Back
      </Button>
    </div>
  );
};

export default GeneralBtns;
