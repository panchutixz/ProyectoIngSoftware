import { useState } from "react";
import { crearReclamo } from "@services/reclamos.service.js";

export function useCrearReclamo() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const registrarReclamo = async (payload) => {
    setLoading(true);
    setError(null);
    try {
      const response = await crearReclamo(payload);
      return response;
    } catch (err) {
      console.error("Error al crear reclamo:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return { registrarReclamo, loading, error };
}