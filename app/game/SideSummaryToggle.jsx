"use client";

import { Tooltip } from "@nextui-org/react";
import ListIcon from "../components/icons/ListIcon";
import { divActionIcon } from "../lib/styles";

const SideSummaryToggle = ({ summaryIsOpen, setSummaryIsOpen }) => {
  return (
    <Tooltip content="Open/Close Summary" color="secondary" variant="flat">
      <div
        onClick={() => setSummaryIsOpen(!summaryIsOpen)}
        className={`${
          summaryIsOpen ? "bg-blue-600" : "bg-secondary hover:bg-blue-400"
        } ${divActionIcon}`}
      >
        <ListIcon />
      </div>
    </Tooltip>
  );
};

export default SideSummaryToggle;
