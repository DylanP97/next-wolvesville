"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { fetchRoles } from "../lib/fetch";

const RolesCarousel = () => {
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const rolesData = await fetchRoles();
      setRoles(rolesData || []);
    };

    fetchData();
  }, []);

  return (
    <div className="flex justify-center items-center z-30">
      <div className="slider">
        <div className="slide-track">
          {roles
            .sort(() => Math.random() - 0.5)
            .map((role) => {
              return (
                <div
                  key={role.name + "-carousel"}
                  className="slide flex justify-center items-center"
                >
                  <Image
                    key={role.name}
                    height={120}
                    width={120}
                    src={role.image}
                    alt=""
                    priority
                    style={{ height: "auto" }}
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
