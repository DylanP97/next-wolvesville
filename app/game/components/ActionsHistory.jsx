"use client";

import { ScrollShadow } from "@nextui-org/react";

const ActionsHistory = ({ messagesHistory, actionsHistoryListRef }) => {
  return (
    <ScrollShadow
      hideScrollBar
      className="w-[100%] h-[120px] bg-slate-950 p-4 my-2 rounded-xl max-h-72">
      <ul className="actions-list text-white" ref={actionsHistoryListRef}>
        {
          messagesHistory.reverse().map((msg, index) => {
            return (
              <li className="text-xs" key={index + "msg"}>{msg.author}: {msg.msg}</li>
            )
          })
        }
      </ul>
    </ScrollShadow>
  );
};

export default ActionsHistory;
