"use client";

import { ScrollShadow } from "@nextui-org/react";

const ActionsHistory = ({ messagesHistory }) => {

  return (
    <div className="w-1/2">
      <h2 className="text-white">General Chat ✉️</h2>
      <ScrollShadow
        hideScrollBar
        size={20}
        className="w-full h-[120px] bg-slate-950 p-2 my-2 rounded-xl max-h-72">
        <ul className="actions-list text-white">
          {
            messagesHistory.map((msg, index) => {
              return (
                <li className="text-xs" key={index + "msg"}>{msg.author && "(" + msg.author + ") "} {msg.msg}</li>
              )
            })
          }
        </ul>
      </ScrollShadow>
    </div>
  );
};

export default ActionsHistory;
