import { useState, useCallback, useRef } from "react";
import { obtenerBicicletasUsuario } from "@services/reclamos.service.js";

export function useGetBicicletasUsuario() {
  const [bicicletas, setBicicletas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const hasFetchedRef = useRef(false);

  const fetchBicicletas = useCallback(async (force = false) => {
    // Si ya se cargó y no es forzado, no hacer nada
    if (hasFetchedRef.current && !force) return;
    
    // Si ya está cargando, no hacer nada
    if (loading) return;

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
      setBicicletas([]);
      hasFetchedRef.current = true;
      throw err;
    } finally {
      setLoading(false);
    }
  }, [loading]);

  const bicicletasPermitidas = bicicletas.filter(bici => 
    bici.estado?.toLowerCase() === "entregada" || 
    bici.estado?.toLowerCase() === "olvidada"
  );

  const hasBicicletas = bicicletas.length > 0;
  const hasBicicletasPermitidas = bicicletasPermitidas.length > 0;

  return { 
    bicicletas, 
    bicicletasPermitidas,
    loading, 
    error, 
    fetchBicicletas,
    hasBicicletas,
    hasBicicletasPermitidas
  };
}

// Componente SelectorBicicletas
export const SelectorBicicletas = ({ 
  bicicletasPermitidas, 
  numeroSerie, 
  setNumeroSerie, 
  cargandoBicicletas, 
  hasBicicletasPermitidas 
}) => {
  if (cargandoBicicletas) {
    return (
      <div className="loading-select">
        <div className="spinner-small"></div>
        Cargando tus bicicletas...
      </div>
    );
  }

  if (!hasBicicletasPermitidas) {
    return (
      <div className="no-bicicletas-message">
        <p>No tienes bicicletas en estado "entregada" o "olvidada".</p>
        <p className="info-text">
          Solo puedes hacer reclamos de bicicletas que estén en esos estados.
        </p>
      </div>
    );
  }

  return (
    <>
      <select
        id="bicicleta-select"
        value={numeroSerie}
        onChange={(e) => setNumeroSerie(e.target.value)}
        className="bicicleta-select"
      >
        <option value="">Selecciona una bicicleta</option>
        {bicicletasPermitidas.map((bicicleta) => (
          <option 
            key={bicicleta.id} 
            value={bicicleta.numero_serie}
            title={`${bicicleta.marca || 'Sin marca'} - ${bicicleta.color || 'Sin color'} (Estado: ${bicicleta.estado})`}
          >
            {bicicleta.numero_serie} - {bicicleta.marca || 'Sin marca'} ({bicicleta.color || 'Sin color'}) - {bicicleta.estado}
          </option>
        ))}
      </select>
      <p className="info-text">
        Tienes {bicicletasPermitidas.length} bicicleta{bicicletasPermitidas.length !== 1 ? 's' : ''} válida{bicicletasPermitidas.length !== 1 ? 's' : ''} para reclamos
      </p>
    </>
  );
};


export default useGetBicicletasUsuario;