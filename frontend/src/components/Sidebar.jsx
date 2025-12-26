import { NavLink, useNavigate } from "react-router-dom";
import { logout } from "../services/auth.service";

const Sidebar = () => {
  const navigate = useNavigate();

  // Obtención de datos del usuario
  const user = JSON.parse(sessionStorage.getItem("usuario")) || null;
  const displayName = user?.nombre || user?.name || user?.username || "";
  const userRole = user?.rol || user?.role || "";

  // Lógica 1: Manejo del cierre de sesión
  const handleLogout = () => {
    try {
      logout();
      navigate("/auth");
    } catch (error) {
      console.error("Error al cerrar sesión", error);
    }
  };

  const handleBicicleterosClick = () => {
    const role = userRole?.toLowerCase();

    if (role === "administrador") {
      navigate("/bicicleteros"); 
    } else  {
      navigate("/consultarBicicleteros");
    } 
  };

  return (
    <div className="w-64 h-screen bg-gray-800 text-white flex flex-col fixed top-0 left-0 z-50">

      {/* Encabezado */}
      <div className="p-6 text-2xl font-bold border-b border-gray-700">
        Bicicletero UBB
      </div>

      {/* Info Usuario */}
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

      {/* Navegación */}
      <nav className="flex-1 p-6">
        <ul className="space-y-4">

          {/* Inicio */}
          <li>
            <button
              onClick={() => navigate("/home")}
              className="w-full text-left hover:bg-gray-700 p-2 rounded"
            >
              Inicio
            </button>
          </li>

          {/* Usuarios */}
          {userRole?.toLowerCase() === "administrador" && userRole?.toLowerCase() === "guardia" && (
          <li>
            <button
              onClick={() => navigate("/usuarios")}
              className="w-full text-left hover:bg-gray-700 p-2 rounded"
            >
              Usuarios
            </button>
          </li>
          )}

          {/* Bicicletas */}
          <li>
            <button
              onClick={() => navigate("/bicicletas")}
              className="w-full text-left hover:bg-gray-700 p-2 rounded"
            >
              Bicicletas
            </button>
          </li>

          {/* Bicicleteros (Con lógica condicional) */}
          <li>
            <button
              onClick={handleBicicleterosClick}
              className="w-full text-left hover:bg-gray-700 p-2 rounded"
            >
              Bicicleteros
            </button>
          </li>

          {/* Asignar Guardias (Solo Administrador) */}
          {userRole?.toLowerCase() === "administrador" && (
            <li>
              <button
                onClick={() => navigate("/asignarGuardias")}
                className="w-full text-left hover:bg-gray-700 p-2 rounded"
              >
                Asignar Guardias
              </button>
            </li>
          )}

          {/* Perfil */}
          <li>
            <NavLink to="/profile" className="w-full block hover:bg-gray-700 p-2 rounded">
              Perfil
            </NavLink>
          </li>

          {/* Reclamos */}
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

          {/* Historial */}
          <li>
            <button
              onClick={() => navigate("/historial")}
              className="w-full text-left hover:bg-gray-700 p-2 rounded"
            >
              Historial
            </button>
          </li>

          {/* Espaciador para empujar el logout al fondo */}
          <li className="flex-grow" />

          {/* Cerrar Sesión */}
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