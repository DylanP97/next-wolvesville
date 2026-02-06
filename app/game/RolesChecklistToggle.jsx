"use client";

import { Tooltip } from "@nextui-org/react";
import { divActionIcon } from "../lib/styles";

const ChecklistIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width="24"
    height="24"
    fill="#fff"
  >
    <path d="M3.5 3.5a1 1 0 0 1 1-1h15a1 1 0 0 1 1 1v17a1 1 0 0 1-1 1h-15a1 1 0 0 1-1-1v-17zm2 1v15h13v-15h-13z" />
    <path d="M7 8.5h2v2H7zM7 13h2v2H7zM7 17.5h2v2H7zM11 9h5v1h-5zM11 13.5h5v1h-5zM11 18h5v1h-5z" />
  </svg>
);

const RolesChecklistToggle = ({ rolesChecklistOpen, setRolesChecklistOpen }) => {
  return (
    <Tooltip content="Roles Checklist" color="secondary" variant="flat">
      <div
        onClick={() => setRolesChecklistOpen(!rolesChecklistOpen)}
        className={`${
          rolesChecklistOpen ? "bg-blue-600" : "bg-secondary hover:bg-blue-400"
        } ${divActionIcon}`}
      >
        <ChecklistIcon />
      </div>
    </Tooltip>
  );
};

export default RolesChecklistToggle;
