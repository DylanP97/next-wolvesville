"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const RolesCarousel = () => {
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await fetch(
          process.env.NEXT_PUBLIC_API_URL + "/api/roles"
        );
        if (response.ok) {
          const rolesData = await response.json();
          setRoles(rolesData);
        } else {
          console.error("Failed to fetch roles");
        }
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    };

    fetchRoles();
  }, []);

  return (
    <div className="flex justify-center items-center">
      <div className="slider">
        <div className="slide-track">
          {roles
            .sort(() => Math.random() - 0.5)
            .map((role) => {
              return (
                <div key={role.name + "-carousel"} className="slide flex justify-center items-center">
                  <Image
                    key={role.name}
                    height={100}
                    width={100}
                    src={role.image}
                    alt=""
                  />
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default RolesCarousel;
