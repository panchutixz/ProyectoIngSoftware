import { useState } from "react";
import { getBicicletas } from "../../services/bicicletas.service.js";
import Swal from "sweetalert2";

export const useGetBicicletas = () => {
    const [bicicletas, setBicicletas] = useState([]);

    const fetchBicicletas = async () => {
        try{
            const response = await getBicicletas();
                setBicicletas(response.data || []); 
            }catch(error){
                console.error("Error al cargar las bicicletas:", error);
                const mensaje = error?.response?.data?.message;
            if (mensaje === "Guardia sin bicicletero asignado") {
                Swal.fire({
                    icon: 'warning',
                    title: 'Acceso restringido',
                    text: 'No tienes un bicicletero asignado. Por favor, contacta al administrador.',
                    confirmButtonText: 'Aceptar'
                });
                setBicicletas();
                return;
            }
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: mensaje || 'Ha ocurrido un error al cargar las bicicletas. Inténtalo de nuevo más tarde.',
                confirmButtonText: 'Aceptar'
            });
            setBicicletas([]);
        }
        
    return { bicicletas, fetchBicicletas };
    }
};
export default useGetBicicletas;