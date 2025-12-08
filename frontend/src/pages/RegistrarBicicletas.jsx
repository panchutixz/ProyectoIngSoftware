import "@styles/bicicletas.css";
import { registerBicicleta } from '@hooks/bicicletas/useRegisterBicicletas.jsx';

    const RegistrarBicicletas = () => {
    const { handleRegisterBicicleta } = registerBicicleta(() => {
    });

    return (
        <div>
        <h1 className="title-register-bicicleta"> Registrar Bicicleta</h1>
        <button className="button-registrar-bicicleta" onClick={handleRegisterBicicleta}>Abrir formulario</button>
        </div>
    );
    };

export default RegistrarBicicletas;
