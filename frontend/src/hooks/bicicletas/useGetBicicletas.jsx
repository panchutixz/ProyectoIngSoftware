import { useState } from "react";
import { getBicicletas } from "../../services/bicicletas.service.js";

export const useGetBicicletas = () => {
    const [bicicletas, setBicicletas] = useState([]);

    const fetchBicicletas = async () => {
        try{
            const data = await getBicicletas();
            setBicicletas(data);
        }catch(error){
            console.error("Error al obtener las bicicletas:", error);
        }
    };
    return { bicicletas, fetchBicicletas };
}

export default useGetBicicletas;