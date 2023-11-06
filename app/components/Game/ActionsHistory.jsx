"use client"

const ActionsHistory = ({
    actionsHistoryListRef
}) => {

  return (
    <div className="bg-slate-900 rounded-xl shadow-lg p-4 my-4">
      <p className="text-white text-xs">Actions history / Chatbox</p>
      <ul className="actions-list" ref={actionsHistoryListRef}></ul>
    </div>
  );
};

export default ActionsHistory;
