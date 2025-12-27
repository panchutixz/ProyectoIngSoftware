import { useState } from "react";
import { getBicicletas } from "../../services/bicicletas.service.js";

export const useGetBicicletas = () => {
    const [bicicletas, setBicicletas] = useState([]);

    const fetchBicicletas = async () => {
        try {
            const response = await getBicicletas();
            setBicicletas(response.data || []);
        } catch (error) {
        console.error("Error al cargar las bicicletas:", error);
            setBicicletas([]);
        }
    };
    return { bicicletas, fetchBicicletas };
};

export default useGetBicicletas;
