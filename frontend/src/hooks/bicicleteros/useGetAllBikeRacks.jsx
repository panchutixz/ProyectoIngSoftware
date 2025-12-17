import { useState } from 'react';
import { getAllBikeRacks } from '@services/bicicleteros.service.js';

export const useGetAllBikeRacks = () => {
    const [bikeRacks, setBikeRacks] = useState([]);
    
    const fetchBikeRacks = async () => {
        try {
            const data = await getAllBikeRacks();
            console.log("Data recibida en el hook:", data);
            setBikeRacks(data);
        } catch (error) {
            console.error("Error al obtener los bicicleteros:", error);
        }
    };

    return { bikeRacks, setBikeRacks, fetchBikeRacks };
};

export default useGetAllBikeRacks;
