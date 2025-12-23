import { useEffect, useState } from "react";
import { obtenerReclamos } from "@services/reclamos.service.js";

export function useGetReclamos() {
  const [reclamos, setReclamos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchReclamos() {
      try {
        const data = await obtenerReclamos();
        setReclamos(data);
      } catch (err) {
        console.error("Error al obtener reclamos:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    }
    fetchReclamos();
  }, []);

  return { reclamos, loading, error };
}