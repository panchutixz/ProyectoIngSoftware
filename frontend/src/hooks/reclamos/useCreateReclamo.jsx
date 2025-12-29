import { useState } from "react";
import { crearReclamo } from "@services/reclamos.service.js";

export function useCreateReclamo() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const registrarReclamo = async (payload) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      const response = await crearReclamo(payload);
      setSuccess(true);
      return response;
    } catch (err) {
      console.error("Error en useCreateReclamo:", err);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const resetState = () => {
    setLoading(false);
    setError(null);
    setSuccess(false);
  };

  return { 
    registrarReclamo, 
    loading, 
    error, 
    success, 
    resetState 
  };
}
