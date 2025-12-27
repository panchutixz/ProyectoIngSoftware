import { useState } from 'react';
import { getBikeRackHistory } from '@services/bicicleteros.service.js'; 

const useGetBikeRackHistory = () => {
    const [history, setHistory] = useState([]);
    const [loadingHistory, setLoadingHistory] = useState(false);

    const fetchHistory = async (idBicicletero, filters = {}) => {
        setLoadingHistory(true);
        try {
            const response = await getBikeRackHistory(idBicicletero, filters);
            
            if (response && response.data) {
                setHistory(response.data);
            }
        } catch (error) {
            console.error("Error cargando historial propio:", error);
            setHistory([]);
        } finally {
            setLoadingHistory(false);
        }
    };

    return { history, fetchHistory, loadingHistory, setHistory };
};

export default useGetBikeRackHistory;