import "@styles/bicicletas.css";
import { useState, useEffect } from 'react';
import { getBicicletas } from '../services/bicicletas.service.js';
import { use } from "react";

const Bicicletas = () => {
    const [bicicletas, setBicicletas] = useState([]);
    const [error] = useState(null);
    useEffect(() => {
        fetchBicicletas();
    }, []);

    const fetchBicicletas = async () => {
        try {
            const data = await getBicicletas();
           console.log("Respuesta del backend:", data); 
           setBicicletas(data);
        } catch (error) {
            console.error("Error al cargar las bicicletas:", error);
        }
    };

    return (
    <div className="bicicletas-page">
    <h1>Listado de Bicicletas</h1>
  <table className="bicicleta-table">
  <thead>
    <tr>
        <th>ID Bicicletero</th>
        <th>Marca</th>
        <th>Color</th>
        <th>Numero_Serie</th>
        <th>Codigo</th>
        <th>Descripción</th>
        <th>Estado</th>
        <th>Rut Usuario</th>
        
    </tr>
    </thead>
    <tbody>
    {bicicletas.map((bici) => (
        <tr key={bici.id}>
        <td>{bici.bicicletero.id_bicicletero}</td>
        <td>{bici.marca}</td>
        <td>{bici.color}</td>
        <td>{bici.numero_serie}</td>
        <td>{bici.codigo}</td>
        <td>{bici.descripcion}</td>
        <td>{bici.estado}</td>
        <td>{bici.usuario.rut}</td>
        
        </tr>
    ))}
  </tbody>
</table>
    {error && <p className="error-message">{error}</p>}
    </div>
    );
}
    
export default Bicicletas;