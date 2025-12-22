// hooks/guardias/useGetAllGuards.jsx
import { useState } from "react";
import { getAllGuards } from "@services/bicicleteros.service.js";

export const useGetAllGuards = () => {
  const [guards, setGuards] = useState([]);

  const fetchGuards = async () => {
    try {
      const data = await getAllGuards();
      setGuards(data);
    } catch (error) {
      console.error("Error al obtener guardias:", error);
    }
  };

  return { guards, setGuards, fetchGuards };
};

export default useGetAllGuards;