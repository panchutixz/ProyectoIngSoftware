import { useState } from "react";
import { actualizarReclamo } from "@services/reclamos.service.js";

export function useEditReclamo() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const actualizar = async (id, payload) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      const response = await actualizarReclamo(id, payload);
      setSuccess(true);
      return response;
    } catch (err) {
      console.error("Error en useUpdateReclamo:", err);
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
    actualizar, 
    loading, 
    error, 
    success, 
    resetState 
  };
}