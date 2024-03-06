"use client";

const ActionsHistory = ({ messagesHistory, type }) => {

  if (type === "jailChat") {
    return (
      <div className="w-full z-10 bg-black-600 p-2">
        <h2 className="text-white">Jail Chat 👮‍♂️</h2>
        <div
          className="h-[120px] p-2 max-h-72 object-bottom overflow-hidden overflow-y-auto">
          <ul className="actions-list text-white">
            {
              messagesHistory.map((msg, index) => {
                return (
                  <li key={index + "msg"} className="text-xs z-20 ">
                    {msg.author}: {msg.msg}
                  </li>
                )
              })
            }
          </ul>
        </div>
      </div>
    )
  } else if (type === "wolves") {
    return (
      <div className="w-full z-10 bg-gray-800 p-2">
        <h2 className="text-white">Wolves Chat 🐺</h2>
        <div
          className="h-[120px] z-10 p-2 max-h-72 object-bottom overflow-hidden overflow-y-auto">
          <ul className="actions-list text-white">
            {
              messagesHistory.map((msg, index) => {
                if (msg.author) {
                  return (
                    <li key={index + "msg"} className="text-xs z-20 text-orange-500">
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
    )
  } else {
    return (
      <div className="w-full z-10 bg-slate-600 p-2">
        <h2 className="text-white">General Chat ✉️</h2>
        <div
          className="h-[120px] p-2 max-h-72 object-bottom overflow-hidden overflow-y-auto z-20">
          <ul className="z-20 actions-list text-white">
            {
              messagesHistory.map((msg, index) => {
                if (msg.author) {
                  return (
                    <li key={index + "msg"} className="text-xs z-20 text-orange-500">
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
    )
  }
};

export default ActionsHistory;
