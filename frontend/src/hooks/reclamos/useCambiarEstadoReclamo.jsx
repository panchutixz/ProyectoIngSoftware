import { useState } from "react";
import { cambiarEstadoReclamo } from "@services/reclamos.service.js";

export function useCambiarEstadoReclamo() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const cambiarEstado = async (id, estado) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      const response = await cambiarEstadoReclamo(id, { estado });
      setSuccess(true);
      return response;
    } catch (err) {
      console.error("Error en useCambiarEstadoReclamo:", err);
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
    cambiarEstado, 
    loading, 
    error, 
    success, 
    resetState 
  };
}