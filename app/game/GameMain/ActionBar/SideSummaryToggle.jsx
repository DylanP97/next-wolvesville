"use client";

const { Button } = require("@nextui-org/react");
import ListIcon from "../../../components/icons/ListIcon";

const SideSummaryToggle = ({ summaryIsOpen, setSummaryIsOpen }) => {
  return (
    <>
      {!summaryIsOpen && (
        <Button
          color="secondary"
          variant="solid"
          onClick={() => setSummaryIsOpen(!summaryIsOpen)}
          className="text-xs"
          isIconOnly
        >
          <ListIcon />
        </Button>
      )}
    </>
  );
};

export default SideSummaryToggle;
