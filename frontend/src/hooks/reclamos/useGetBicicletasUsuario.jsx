import { useState, useCallback } from "react";
import { obtenerBicicletasUsuario } from "@services/reclamos.service.js";

export function useGetBicicletasUsuario() {
  const [bicicletas, setBicicletas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchBicicletas = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await obtenerBicicletasUsuario();
      setBicicletas(data);
      return data;
    } catch (err) {
      console.error("Error en useGetBicicletasUsuario:", err);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const hasBicicletas = bicicletas.length > 0;

  return { 
    bicicletas, 
    loading, 
    error, 
    fetchBicicletas,
    hasBicicletas
  };
}