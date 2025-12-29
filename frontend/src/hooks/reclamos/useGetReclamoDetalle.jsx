import { useState, useCallback } from "react";
import { obtenerReclamoPorId } from "@services/reclamos.service.js";

export function useGetReclamoDetalle() {
  const [reclamoDetalle, setReclamoDetalle] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchReclamoDetalle = useCallback(async (id) => {
    if (!id) return;
    
    setLoading(true);
    setError(null);
    setReclamoDetalle(null);
    
    try {
      const response = await obtenerReclamoPorId(id);
      setReclamoDetalle(response.data);
      return response.data;
    } catch (err) {
      console.error("Error en useGetReclamoDetalle:", err);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const resetDetalle = () => {
    setReclamoDetalle(null);
    setError(null);
  };

  return { 
    reclamoDetalle, 
    loading, 
    error, 
    fetchReclamoDetalle,
    resetDetalle
  };
}