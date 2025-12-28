import { useState, useEffect } from 'react';
import { obtenerHistorial, obtenerHistorialPorUsuario } from '@services/historial.service.js';

export const useGetHistorial = () => {
    const [historial, setHistorial] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const fetchHistorial = async () => {
        setLoading(true);
        setError(null);
        try {
            // Obtener usuario de sessionStorage
            const user = JSON.parse(sessionStorage.getItem('usuario')) || null;
            
            if (!user) {
                throw new Error('No hay usuario autenticado');
            }
            
            const role = (user.rol || user.role || '').toString().toLowerCase();
            const isAdmin = role.includes('admin') || role.includes('administrador');
            const isGuardia = role.includes('guardia');
            
            let data;
            
            if (isAdmin || isGuardia) {
                console.log('Obteniendo historial completo (admin/guardia)');
                data = await obtenerHistorial();
            } else {
                const rut = user.rut || user.id;
                if (!rut) {
                    throw new Error('No se encontró RUT del usuario');
                }
                console.log(`Obteniendo historial para RUT: ${rut}`);
                data = await obtenerHistorialPorUsuario(rut);
            }
            
            console.log("Data recibida en el hook:", data);
            setHistorial(data || []);
            
        } catch (error) {
            console.error("Error al obtener el historial:", error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return { historial, loading, error, fetchHistorial };
};

export default useGetHistorial;