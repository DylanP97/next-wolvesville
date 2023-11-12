"use client";

import RoleCard from "./RoleCard";
import characters from "../../lib/characters";

const RolesGrid = () => {
  return (
    <section className="mb-10 py-16">
      <h2 className="text-lg font-bold p-4">List of Roles</h2>
      <div className="w-full grid grid-cols-3 gap-4">
        {characters.map((character) => (
          <RoleCard key={character.name} character={character} />
        ))}
      </div>
    </section>
  );
};

export default RolesGrid;
