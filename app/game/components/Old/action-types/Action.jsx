"use client";

import { Button } from "@nextui-org/react";

const Action = ({ onClick, label, kbdComponent, bgColor, dataname }) => (
  <Button className="my-2 w-full" dataname={dataname} variant="ghost" color="primary" onClick={() => onClick()}>
    {label} {kbdComponent}
  </Button>
);

export default Action;
