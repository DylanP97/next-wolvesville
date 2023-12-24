"use client"

const Action = ({ onClick, label, kbdComponent, bgColor, dataname }) => (
  <div
    dataname={dataname}
    onClick={onClick}
    className={`z-20 rounded-xl shadow-lg p-4 cursor-pointer ${bgColor}`}>
    <p className="text-xs text-gray-200">{label}</p>
    {kbdComponent}
  </div>
);

export default Action;
