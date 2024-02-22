"use client";

import { ScrollShadow } from "@nextui-org/react";

const ActionsHistory = ({ messagesHistory }) => {
  return (
    <ScrollShadow
      hideScrollBar
      className="w-1/2 h-[120px] bg-slate-950 p-4 my-2 rounded-xl max-h-72">
      <ul className="actions-list text-white">
        {
          messagesHistory.reverse().map((msg, index) => {
            return (
              <li className="text-xs" key={index + "msg"}>{msg.author && "(" + msg.author + ") "} {msg.msg}</li>
            )
          })
        }
      </ul>
    </ScrollShadow>
  );
};

export default ActionsHistory;
