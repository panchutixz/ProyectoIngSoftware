import "@styles/bicicletas.css";
import { useState, useEffect } from 'react';
import { getBicicletas} from '../services/bicicletas.service.js';
import { reIngresoBicicleta } from '@hooks/bicicletas/useReIngresoBicicletas.jsx';
import { registerBicicleta } from '@hooks/bicicletas/useRegisterBicicletas.jsx';
const Bicicletas = () => {
    const [bicicletas, setBicicletas] = useState([]);
    const [error] = useState(null);

    const fetchBicicletas = async () => {
        try {
            const data = await getBicicletas();
            console.log("Respuesta del backend:", data); 
            setBicicletas(data);
        } catch (error) {
            console.error("Error al cargar las bicicletas:", error);
        }
    };

    useEffect(() => {
        fetchBicicletas();
    }, []);

    const {handleReIngresoBicicleta} = reIngresoBicicleta();
    const { handleRegisterBicicleta } = registerBicicleta(fetchBicicletas);

    return (
    <div className="bicicletas-page">
        <div className="bicicletas-header">
            <h1 className="title-listar-bicicletas">Listado de Bicicletas</h1>
            <button className="button-registrar-bicicleta" onClick={handleRegisterBicicleta}>Registrar Bicicleta</button>
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
        <th>Re-Ingresar</th>
        
    </tr>
    </thead>
    <tbody>

    {bicicletas.map((bici) => (
        <tr key={bici.id}>
        <td>{bici.bicicletero.nombre}</td>
        <td>{bici.marca}</td>
        <td>{bici.color}</td>
        <td>{bici.numero_serie}</td>
        <td>{bici.codigo}</td>
        <td>{bici.descripcion}</td>
        <td>{bici.estado}</td>
        <td>{bici.usuario.rut}</td>
        <td>
            <button className="btn-icon" onClick={handleReIngresoBicicleta}>
            <i className="fa-solid fa-arrow-right-to-bracket"></i>
            </button>
        </td>
        </tr>
    ))}
    </tbody>
</table>
    {error && <p className="error-message">{error}</p>}
    </div>
    );
}
    
export default Bicicletas;