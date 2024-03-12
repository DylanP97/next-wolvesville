"use client";

const ActionsHistory = ({ messagesHistory, type }) => {

  const emoji = {
    "Jail": '👮‍♂️',
    "Wolves": '🐺',
    "Village": '🏘️',
  }

  return (
    <div className="w-full z-10 bg-gray-800 p-2">
      <h2 className="text-white">{type} Chat {emoji[type]}</h2>
      <div
        className="h-[120px] z-10 p-2 max-h-72 object-bottom overflow-hidden overflow-y-auto">
        <ul className="actions-list text-white">
          {
            messagesHistory.map((msg, index) => {
              if (msg.author) {
                return (
                  <li key={index + "msg"} datatype={index + "msg"} className={`text-xs z-20 ${index == 0 && "font-bold"}`}>
                    {msg.time} -- {msg.author}: {msg.msg}
                  </li>
                )
              }
              return (
                <li className={`text-xs z-20 ${index == 0 && "font-bold"}`} key={index + "msg"}>{msg.time} -- {msg.msg}</li>
              )
            })
          }
        </ul>
      </div>
    </div>
  )
};

export default ActionsHistory;
