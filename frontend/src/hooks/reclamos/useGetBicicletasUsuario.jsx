import { useState, useCallback, useRef } from "react";
import { obtenerBicicletasUsuario } from "@services/reclamos.service.js";

export function useGetBicicletasUsuario(shouldFetch = true) {
  const [bicicletas, setBicicletas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const hasFetchedRef = useRef(false);

  const fetchBicicletas = useCallback(async () => {
    //para prevenir multiples llamadas al mismo tiempo
    if (loading) return;
    
    //si ya se intento y hubo error reciente, no reintentar automaticamente
    if (error && hasFetchedRef.current) return;

    setLoading(true);
    setError(null);
    
    try {
      const data = await obtenerBicicletasUsuario();
      setBicicletas(data);
      hasFetchedRef.current = true;
      return data;
    } catch (err) {
      console.error("Error en useGetBicicletasUsuario:", err);
      setError(err.message || "Error al cargar bicicletas");
      hasFetchedRef.current = true;
      throw err;
    } finally {
      setLoading(false);
    }
  }, [loading, error]);

  const hasBicicletas = bicicletas.length > 0;

  return { 
    bicicletas, 
    loading, 
    error, 
    fetchBicicletas,
    hasBicicletas,
  };
}