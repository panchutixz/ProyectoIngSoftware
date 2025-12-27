import "@styles/asignarGuardias.css";
import useGetAllBikeRacks from "@hooks/bicicleteros/useGetAllBikeRacks.jsx";
import { useGetAllGuards } from "@hooks/bicicleteros/useGetAllGuards.jsx";
import { useAssignGuard } from "@hooks/bicicleteros/useAssignGuard.jsx";
import { useEffect, useState, useRef } from "react";

// Menú para seleccionar guardia
const SearchableSelect = ({ options, selectedValue, onChange, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const wrapperRef = useRef(null);

  // Cierra el menú si hacen clic fuera de él
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [wrapperRef]);

  // Filtra por nombre de guardia
  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Encuentra la etiqueta del valor seleccionado actualmente
  const selectedLabel = options.find((o) => o.value === selectedValue)?.label;

  return (
    <div className="custom-select-container" ref={wrapperRef}>
      <div
        className="custom-select-trigger"
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedLabel || placeholder}
        <span className="arrow">▼</span>
      </div>

      {/* Menú desplegable con el buscador */}
      {isOpen && (
        <div className="custom-select-options">
          <input
            type="text"
            className="custom-select-search"
            placeholder="Buscar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            autoFocus
            onClick={(e) => e.stopPropagation()} // Evita cerrar al hacer clic en el input
          />
          <ul className="options-list">
            {/* Opción para quitar guardia */}
            <li
              className="option-item"
              onClick={() => { onChange(""); setIsOpen(false); }}
            >
              - Sin guardia -
            </li>

            {/* Lista de guardias filtrados */}
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <li
                  key={option.value}
                  className={`option-item ${selectedValue === option.value ? "selected" : ""}`}
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                    setSearchTerm(""); // Limpiar búsqueda al seleccionar
                  }}
                >
                  {option.label}
                </li>
              ))
            ) : (
              <li className="option-no-results">No se encontraron guardias</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

const AsignarGuardias = () => {
  const { bikeRacks, fetchBikeRacks } = useGetAllBikeRacks();
  const { guards, fetchGuards } = useGetAllGuards();
  const { handleAssignGuard } = useAssignGuard(fetchBikeRacks);

  useEffect(() => {
    fetchBikeRacks();
    fetchGuards();
  }, []);

  // Array { value: id, label: "Nombre Apellido" }
  const guardOptions = guards.map(g => ({
    value: g.id,
    label: `${g.nombre} ${g.apellido}`
  }));

  return (
    <div className="asignarGuardias-page">
      <div className="asignarGuardias-header">
        <h2>Asignar guardias</h2>
      </div>

      <table className="asignarGuardias-table">
        <thead>
          <tr>
            <th>Bicicletero</th>
            <th>Ubicación</th>
            <th style={{ width: '300px' }}>Asignar guardia</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(bikeRacks) && bikeRacks.length > 0 ? (
            bikeRacks.map((bikeRack) => {
              // Búsqueda de guardia actual
              const guardiaActual = bikeRack.usuarios?.find(
                (u) => (u.rol || u.role || "").toString().toLowerCase() === "guardia"
              );
              const valorSelect = guardiaActual ? guardiaActual.id : "";

              return (
                <tr key={bikeRack.id_bicicletero}>
                  <td>{bikeRack.nombre}</td>
                  <td>{bikeRack.ubicacion}</td>

                  <td style={{ overflow: 'visible' }}>
                    <SearchableSelect
                      options={guardOptions}
                      selectedValue={valorSelect}
                      placeholder="- Sin guardia -"
                      onChange={(nuevoId) => {
                        // Si es string vacío (sin guardia) o número
                        handleAssignGuard(bikeRack.id_bicicletero, nuevoId ? Number(nuevoId) : null);
                      }}
                    />
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="3">No hay bicicleteros registrados</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AsignarGuardias;