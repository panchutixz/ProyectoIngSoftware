import "@styles/bicicleteros.css";
import useGetAllBikeRacks from "@hooks/bicicleteros/useGetAllBikeRacks.jsx";
import useDeleteBikeRack from "@hooks/bicicleteros/useDeleteBikeRack.jsx";
import useCreateBikeRack from "@hooks/bicicleteros/useCreateBikeRack.jsx";
import useGetBikeRackHistory from "@hooks/bicicleteros/useGetBikeRackHistory.jsx";
import { useEditBikeRack } from "@hooks/bicicleteros/useEditBikeRack.jsx";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function transformarEstado(estado) {
  const estadoReal = estado;
  if (!estadoReal) return "Desconocido";
  const estadoNormalizado = estadoReal.toLowerCase().trim();
  if (estadoNormalizado === "abierto") return "Habilitado";
  if (estadoNormalizado === "cerrado") return "No habilitado";
  return estadoReal;
}

const BikeRacks = () => {
  const { bikeRacks, fetchBikeRacks } = useGetAllBikeRacks();
  const { handleDeleteBikeRack } = useDeleteBikeRack(fetchBikeRacks);
  const { handleCreateBikeRack } = useCreateBikeRack(fetchBikeRacks);
  const { handleEditBikeRack } = useEditBikeRack(fetchBikeRacks);

  // Se inicializa el HOOK del historial
  const { history, fetchHistory, loadingHistory, setHistory } = useGetBikeRackHistory();

  // Estados para el modal y filtros
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [selectedBikeRack, setSelectedBikeRack] = useState(null);
  const [filterRut, setFilterRut] = useState("");
  const [filterDate, setFilterDate] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetchBikeRacks();
  }, []);

  // Abre el historial
  const handleOpenHistory = (bikeRack) => {
    setSelectedBikeRack(bikeRack);
    setFilterRut("");
    setFilterDate("");
    setHistory([]); // Limpia historial previo
    fetchHistory(bikeRack.id_bicicletero);
    setShowHistoryModal(true);
  };

  // Aplica filtros dentro del modal
  const handleApplyFilters = () => {
    if (selectedBikeRack) {
      fetchHistory(selectedBikeRack.id_bicicletero, { rut: filterRut, fecha: filterDate });
    }
  };

  return (
    <div className="bicicleteros-page">
      <div className="bicicleteros-header">
        <h2>Lista de bicicleteros</h2>
        <button
          className="bicicleteros-addbtn"
          onClick={() => handleCreateBikeRack()}
        >
          Añadir
        </button>
      </div>

      <table className="bicicleteros-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Ubicación</th>
            <th>Capacidad</th>
            <th>Ocupados</th>
            <th>Disponibles</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(bikeRacks) && bikeRacks.length > 0 ? (
            bikeRacks.map((bikeRack) => (
              <tr key={bikeRack.id_bicicletero}>
                <td>{bikeRack.nombre}</td>
                <td>{bikeRack.ubicacion}</td>
                <td>{bikeRack.capacidad}</td>

                <td style={{ fontWeight: "bold", color: "#d32f2f" }}>
                  {bikeRack.ocupados ?? 0}
                </td>
                <td style={{ fontWeight: "bold", color: "#388e3c" }}>
                  {bikeRack.disponibles ?? bikeRack.capacidad}
                </td>

                <td>{transformarEstado(bikeRack.estado)}</td>
                <td>
                  <button
                    className="edit-btn"
                    style={{ marginRight: '10px', fontWeight: "bold", color: '#2196F3', padding: '5px 10px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                    onClick={() => handleEditBikeRack(bikeRack)}
                  >
                    Editar
                  </button>
                  <button
                    className="history-btn"
                    style={{ marginRight: '10px', fontWeight: "bold", color: '#378f92ff', padding: '5px 10px', border: 'none', borderRadius: '4px', cursor: 'pointer', background: 'transparent' }}
                    onClick={() => handleOpenHistory(bikeRack)}
                  >
                    Historial
                  </button>

                  <button
                    className="delete"
                    onClick={() => handleDeleteBikeRack(bikeRack.id_bicicletero)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7">No hay bicicleteros registrados</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* MODAL DE HISTORIAL */}
      {showHistoryModal && (
    <div className="modal-overlay">
    <div className="bg-white p-6 rounded-lg shadow-xl w-[900px] max-w-[90%] max-h-[85vh] overflow-y-auto">
            <h3>Historial: {selectedBikeRack?.nombre}</h3>

            {/* Controles de Filtro */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
              <input
                type="text"
                placeholder="Filtrar por RUT..."
                value={filterRut}
                onChange={(e) => setFilterRut(e.target.value)}
                style={{ padding: '5px' }}
              />
              <input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                style={{ padding: '5px' }}
              />
              <button onClick={handleApplyFilters} style={{ cursor: 'pointer', padding: '5px 10px' }}>Filtrar</button>
            </div>

            {/* Tabla del Historial */}
            <div className="modal-scroll-area">
              {loadingHistory ? (
                <p>Cargando datos...</p>
              ) : history.length > 0 ? (
                <table className="history-table">
                  <thead>
                    <tr style={{ borderBottom: '1px solid #eee' }}>
                      <th style={{ textAlign: 'left' }}>Fecha</th>
                      <th style={{ textAlign: 'left' }}>Usuario</th>
                      <th style={{ textAlign: 'left' }}>RUT</th>
                      <th style={{ textAlign: 'left' }}>N° Serie</th>
                      <th style={{ textAlign: 'left' }}>Bicicleta</th>
                      <th style={{ textAlign: 'left' }}>Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((h) => (
                      <tr key={h.id} style={{ borderBottom: '1px solid #f9f9f9' }}>
                        <td>{new Date(h.fecha).toLocaleString()}</td>
                        <td>{h.usuario}</td>
                        <td style={{ textAlign: 'left', minWidth: '120px' }}>{h.rut}</td>
                        <td>{h.numero_serie}</td>
                        <td>{h.bicicleta}</td>
                        <td style={{
                          color: h.accion === "Ingreso" ? '#2196F3': h.accion === "Re-ingreso" ? '#388e3c' : h.accion === "Retiro" ? '#FF9800' : '#d32f2f',
                          fontWeight: 'bold'
                        }}>
                          {h.accion}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>No se encontraron registros para este bicicletero.</p>
              )}
            </div>

            <div style={{ marginTop: '20px', textAlign: 'right' }}>
              <button
                onClick={() => setShowHistoryModal(false)}
                style={{ padding: '8px 15px', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default BikeRacks;