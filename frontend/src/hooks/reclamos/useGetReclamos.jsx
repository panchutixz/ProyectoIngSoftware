import { useState, useCallback } from "react";
import { obtenerReclamos, buscarReclamosFiltrados } from "@services/reclamos.service.js";

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

  const buscarReclamos = useCallback(async (filtros) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await buscarReclamosFiltrados(filtros);
      const data = response.data?.reclamos || [];
      setReclamos(data);
      return data;
    } catch (err) {
      console.error("Error en buscarReclamos:", err);
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
    buscarReclamos,
    setReclamos // para updates locales
  };
}