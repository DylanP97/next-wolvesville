"use client";

import { ScrollShadow } from "@nextui-org/react";

const WolvesActionsHistory = ({ messagesHistory }) => {

    return (
        <div className="w-1/2">
            <h2 className="text-white">Wolves' chat 🐺</h2>
            <ScrollShadow
                hideScrollBar
                className="w-full h-[120px] bg-gray-800 p-4 my-2 rounded-xl max-h-72">
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

export default WolvesActionsHistory;
