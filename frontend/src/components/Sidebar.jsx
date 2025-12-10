    import { logout } from "../services/auth.service";
    import { useNavigate } from "react-router-dom";

    const Sidebar = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    return (
        <div className="w-64 h-screen bg-gray-800 text-white flex flex-col fixed top-0 left-0 z-50">
        <div className="p-6 text-2xl font-bold border-b border-gray-700">
            Bicicletero UBB
        </div>
        <nav className="flex-1 p-6">
            <ul className="space-y-4">
            <li>
                <button
                onClick={() => navigate("/home")}
                className="w-full text-left hover:bg-gray-700 p-2 rounded"
                >
                Inicio
                </button>
            </li>
            <li>
                <button
                onClick={() => navigate("/usuarios")}
                className="w-full text-left hover:bg-gray-700 p-2 rounded"
                >
                Usuarios
                </button>
            </li>
            <li>
                <button
                onClick={() => navigate("/bicicletas")}
                className="w-full text-left hover:bg-gray-700 p-2 rounded"
                >
                Bicicletas
                </button>
            </li>
            <li>
                <button
                onClick={() => navigate("/registrarBicicletas")}
                className="w-full text-left hover:bg-gray-700 p-2 rounded"
                >
                Añadir Bicicletas
                </button>
            </li>
            <li>
                <button
                onClick={() => navigate("/perfil")}
                className="w-full text-left hover:bg-gray-700 p-2 rounded"
                >
                Perfil
                </button>
            </li>
            <li>
                <button
                onClick={() => navigate("/bicicleteros")}
                className="w-full text-left hover:bg-gray-700 p-2 rounded"
                >
                Bicicleteros
                </button>
            </li>
            <li>
                <button
                onClick={handleLogout}
                className="w-full text-left hover:bg-gray-700 p-2 rounded"
                >
                Cerrar Sesión
                </button>
            </li>
            </ul>
        </nav>
        </div>
    );
    };

    export default Sidebar;
