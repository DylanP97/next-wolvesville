"use client";

const WolvesActionsHistory = ({ messagesHistory }) => {

    return (
        <div className="w-full bg-gray-800 p-2">
            <h2 className="text-white">Wolves' Chat 🐺</h2>
            <div
                className="h-[120px] p-2 max-h-72 object-bottom overflow-hidden overflow-y-auto">
                <ul className="actions-list text-white">
                    {
                        messagesHistory.map((msg, index) => {
                            if (msg.author) {
                                return (
                                    <li key={index + "msg"} className="text-xs text-orange-500">
                                        {msg.author}: {msg.msg}
                                    </li>
                                )
                            }
                            return (
                                <li className="text-xs" key={index + "msg"}>{msg.msg}</li>
                            )
                        })
                    }
                </ul>
            </div>
        </div>
    );
};

export default WolvesActionsHistory;
