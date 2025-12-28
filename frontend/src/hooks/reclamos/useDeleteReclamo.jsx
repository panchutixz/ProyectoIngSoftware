import { useState } from "react";
import { eliminarReclamo } from "@services/reclamos.service.js";

export function useDeleteReclamo() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [deletedId, setDeletedId] = useState(null);

  const eliminar = async (id) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    setDeletedId(null);
    
    try {
      const response = await eliminarReclamo(id);
      setSuccess(true);
      setDeletedId(id);
      return response;
    } catch (err) {
      console.error("Error en useDeleteReclamo:", err);
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
    setDeletedId(null);
  };

  return { 
    eliminar, 
    loading, 
    error, 
    success, 
    deletedId,
    resetState 
  };
}