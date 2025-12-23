    import { NavLink, useNavigate } from "react-router-dom";
import { logout } from "../services/auth.service";

const Sidebar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(sessionStorage.getItem("usuario")) || null;
  const displayName = user?.nombre || user?.name || user?.username || "";
  const userRole = user?.rol || user?.role || "";

  const handleLogout = () => {
    try {
      logout();
      navigate("/auth");
    } catch (error) {
      console.error("Error al cerrar sesión", error);
    }
  };

  return (
    <div className="w-64 h-screen bg-gray-800 text-white flex flex-col fixed top-0 left-0 z-50">
      <div className="p-6 text-2xl font-bold border-b border-gray-700">Bicicletero UBB</div>

      <div className="p-4 border-b border-gray-700">
        {displayName ? (
          <div>
            <p className="text-sm">Hola, <strong>{displayName}</strong></p>
            {userRole && <p className="text-xs text-gray-300">{userRole}</p>}
          </div>
        ) : (
          <p className="text-sm">Usuario</p>
        )}
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
              onClick={() => navigate("/bicicleteros")}
              className="w-full text-left hover:bg-gray-700 p-2 rounded"
            >
              Bicicleteros
            </button>
          </li>

          <li>
            <button
              onClick={() => navigate("/asignarGuardias")}
              className="w-full text-left hover:bg-gray-700 p-2 rounded"
            >
              Asignar Guardias
            </button>
          </li>

          <li>
            <NavLink to="/profile" className="w-full block hover:bg-gray-700 p-2 rounded">
              Perfil
            </NavLink>
          </li>
          <li>
            <button
              onClick={() => navigate("/Misreclamos")}
              className="w-full text-left hover:bg-gray-700 p-2 rounded"
            >
              {userRole?.toLowerCase() === "administrador" || userRole?.toLowerCase() === "guardia" 
                ? "Reclamos" 
                : "Mis Reclamos"}
            </button>
          </li>
          <li>
            <button
              onClick={() => navigate("/historial")}
              className="w-full text-left hover:bg-gray-700 p-2 rounded"
            >
              Historial
            </button>
          </li>

          <li className="flex-grow" />

          <li>
            <button
              onClick={handleLogout}
              className="w-full text-left hover:bg-red-700 bg-red-600 p-2 rounded"
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
