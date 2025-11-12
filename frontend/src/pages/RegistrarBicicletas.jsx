
import { registerBicicleta } from '@hooks/bicicletas/useRegisterBicicletas.jsx';

    const RegistrarBicicletas = () => {
    const { handleRegisterBicicleta } = registerBicicleta(() => {
    });

    return (
        <div>
        <h1>Registrar Bicicleta</h1>
        <button onClick={handleRegisterBicicleta}>Abrir formulario</button>
        </div>
    );
    };

export default RegistrarBicicletas;
