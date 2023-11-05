"use client";

import React from "react";
import RoleCard from "./RoleCard";
import characters from "../../data/characters";

const RolesGrid = () => {
  return (
    <section className="my-6">
      <h2 className="text-lg font-bold p-4">List of Roles</h2>
      <div className="w-full grid grid-cols-4 gap-4">
        {characters.map((character) => (
          <RoleCard key={character.name} character={character} />
        ))}
      </div>
    </section>
  );
};

export default RolesGrid;
