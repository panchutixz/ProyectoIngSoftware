import "@styles/bicicletas.css";
import { useState, useEffect } from 'react';
import { getBicicletas, getUserBicycles} from '../services/bicicletas.service.js';
import { reIngresoBicicleta} from '@hooks/bicicletas/useReIngresoBicicletas.jsx';
import { registerBicicleta } from '@hooks/bicicletas/useRegisterBicicletas.jsx';
import { retirarBicicletas } from '@hooks/bicicletas/useRetirarBicicletas.jsx';
import { editarBicicleta } from '@hooks/bicicletas/useEditBicicletas.jsx';
import { deleteBicicleta } from '@hooks/bicicletas/useDeleteBicicletas.jsx';
import { useAuth } from "../context/AuthContext.jsx";

const estadoColors = {
    guardada: '#007bff',    
    entregada: '#28a745',   
    olvidada: '#ff0000ff'   
};

function estadoStyle(estado) {
    const color = estadoColors[estado?.toLowerCase().trim()] || '#6c757d';

    return {
    backgroundColor: color,
    color: '#fff',
    padding: '4px 8px',
    borderRadius: 12,
    display: 'inline-block',
    fontWeight: 'bold',
    textTransform: 'capitalize'
    };
}


const Bicicletas = () => {
    const { user } = useAuth();
    const [bicicletas, setBicicletas] = useState([]);
    const [error] = useState(null);

    const fetchBicicletas = async () => {
        try {
            let bicicletaData;
            if (user.rol.toLowerCase() === "estudiante" || user.rol.toLowerCase() === "academico" || user.rol.toLowerCase() === "funcionario") {
                bicicletaData = await getUserBicycles(user.rut);
            } else {
                bicicletaData = await getBicicletas();
            }
            setBicicletas(bicicletaData);
        } catch (error) {
            console.error("Error al cargar las bicicletas:", error);
        }
    };

    useEffect(() => {
        console.log("Usuario autenticado:", user);
        fetchBicicletas();
        const interval = setInterval(() => {
            fetchBicicletas();
        }, 60000); // Actualiza cada 60 segundos
        return () => clearInterval(interval);
    }, []);

    const { handleReIngresoBicicleta } = reIngresoBicicleta(fetchBicicletas);
    const { handleRegisterBicicleta } = registerBicicleta(fetchBicicletas);
    const { handleRetirarBicicleta } = retirarBicicletas(fetchBicicletas);
    const { handleEditarBicicleta } = editarBicicleta(fetchBicicletas);
    const { handleDeleteBicicleta} = deleteBicicleta(fetchBicicletas);


    return (
        <div className="bicicletas-page">
            <div className="bicicletas-header">
                <h1 className="title-listar-bicicletas">Listado de Bicicletas</h1>
                    {user && user.rol === 'Guardia' && (user.bicicletero_id) &&(
                    <>
                        <button className="button-registrar-bicicleta" onClick={handleRegisterBicicleta}>Registrar Bicicleta</button>
                        <button className="button-retirar-bicicleta" onClick={handleRetirarBicicleta}>Retirar Bicicleta</button>
                    </>
                )}
            </div>

            <table className="bicicleta-table">
                <thead>
                    <tr>
                        <th>Bicicletero</th>
                        <th>Marca</th>
                        <th>Color</th>
                        <th>Número Serie</th>
                        <th>Código</th>
                        <th>Descripción</th>
                        <th>Estado</th>
                        <th>Rut Usuario</th>
                        {user && user.rol === 'Guardia' && <th>Re-Ingresar</th>}
                        <th>Acciones</th>
                    </tr>
                </thead>
                    <tbody>
            {Array.isArray(bicicletas) && bicicletas.length > 0 ? (
                bicicletas.map((bici) => (
                <tr key={bici.id}>
                    <td>{bici.bicicletero.nombre}</td>
                    <td className="capitalize">{bici.marca}</td>
                    <td className="capitalize">{bici.color}</td>
                    <td>{bici.numero_serie}</td>
                    <td>{bici.codigo}</td>
                    <td>{bici.descripcion}</td>
                    <td><span style={estadoStyle(bici.estado)}>{bici.estado}</span></td>
                    <td>{bici.usuario.rut}</td>
                    {user.rol === 'Guardia' && (
                    <td>
                        <button className="btn-icon" onClick={handleReIngresoBicicleta}>
                        <i className="fa-solid fa-arrow-right-to-bracket"></i>
                        </button>
                    </td>
                    )}
                    {user.rol === 'Guardia' && (
                    <td>
                        <button className="btn-editar-bici" onClick={handleEditarBicicleta}>Editar</button>
                        <button className="btn-delete-bici" onClick={handleDeleteBicicleta}>Eliminar</button>
                    </td>
                    )}

                </tr>
                ))
            ) : (
                <tr>
                <td colSpan="10">
                    {user.rol === "Guardia" && !user.bicicletero_id && "No tiene biciclero asignado, contacte con el Administrador."}
                    {user.rol === "Guardia" && user.bicicletero_id && "No tiene bicicletas registradas."}
                    {user.rol === "Administrador" && "No hay bicicletas registradas"}
                    {user.rol === "estudiante" && "No tienes bicicletas registradas en tu cuenta."}
                    {(user.rol === "Academico" || user.rol === "Funcionario") && "No se encontraron bicicletas."}
                </td>


                </tr>
            )}
                </tbody>

            </table>

            {error && <p className="error-message">{error}</p>}
        </div>
    );
}
    
export default Bicicletas;