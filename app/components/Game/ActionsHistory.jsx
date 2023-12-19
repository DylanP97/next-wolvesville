"use client";

import { ScrollShadow } from "@nextui-org/react";

const ActionsHistory = ({ actionsHistoryListRef }) => {
  return (
    <ScrollShadow
      hideScrollBar
      className="w-[100%] h-[200px] bg-slate-900 p-4 my-4 rounded-lg max-h-72">
      <ul className="actions-list text-white" ref={actionsHistoryListRef}></ul>
    </ScrollShadow>
  );
};

export default ActionsHistory;
