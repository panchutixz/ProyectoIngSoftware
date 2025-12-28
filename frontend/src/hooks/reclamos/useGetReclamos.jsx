import { useState, useCallback } from "react";
import { obtenerReclamos } from "@services/reclamos.service.js";

export function useGetReclamos() {
  const [reclamos, setReclamos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchReclamos = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await obtenerReclamos();
      setReclamos(data);
      return data;
    } catch (err) {
      console.error("Error en useGetReclamos:", err);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { 
    reclamos, 
    loading, 
    error, 
    fetchReclamos,
    setReclamos // Para updates locales
  };
}