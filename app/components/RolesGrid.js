"use";

import React from "react";
import RoleCard from "./RoleCard";
import characters from "../data/characters";

const RolesGrid = () => {
  return (
    <section className="my-6">
      <p>List of Roles</p>
      <div className="grid grid-cols-3 gap-4">
        {characters.map((character) => (
          <RoleCard key={character.name} character={character} />
        ))}
      </div>
    </section>
  );
};

export default RolesGrid;
