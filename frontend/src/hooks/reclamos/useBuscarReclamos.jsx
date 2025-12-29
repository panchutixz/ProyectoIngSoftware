import { useState, useCallback } from "react";
import { buscarReclamosFiltrados } from "@services/reclamos.service.js";

export function useBuscarReclamos() {
  const [reclamosFiltrados, setReclamosFiltrados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 1
  });

  const buscar = useCallback(async (filtros = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await buscarReclamosFiltrados(filtros);
      
      setReclamosFiltrados(response.data?.reclamos || []);
      setPagination(response.data?.pagination || {
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 1
      });
      
      return response;
    } catch (err) {
      console.error("Error en useBuscarReclamos:", err);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const resetFiltros = () => {
    setReclamosFiltrados([]);
    setPagination({
      page: 1,
      limit: 20,
      total: 0,
      totalPages: 1
    });
  };

  return { 
    reclamosFiltrados, 
    loading, 
    error, 
    pagination,
    buscar,
    resetFiltros
  };
}