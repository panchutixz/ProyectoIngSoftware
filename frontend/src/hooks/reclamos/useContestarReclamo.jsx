import { useState } from "react";
import { contestarReclamo } from "@services/reclamos.service.js";

export function useContestarReclamo() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const contestar = async (id, payload) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      const response = await contestarReclamo(id, payload);
      setSuccess(true);
      return response;
    } catch (err) {
      console.error("Error en useContestarReclamo:", err);
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
    contestar, 
    loading, 
    error, 
    success, 
    resetState 
  };
}