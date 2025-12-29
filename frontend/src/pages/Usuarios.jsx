import "@styles/usuarios.css";
import useGetUser from "@hooks/usuario/useGetUser.jsx";
import useDeleteUser from "@hooks/usuario/useDeleteUser.jsx";
import useCreateUser from "@hooks/usuario/useCreateUser.jsx";       // Hook para Administrador
import useCreateUserGuard from "@hooks/usuario/useCreateUserGuard.jsx"; // Hook para Guardia
import useEditUser from "@hooks/usuario/useEditUser.jsx";           // Hook para Administrador
import useEditUserGuard from "@hooks/usuario/useEditUserGuard.jsx"; // Hook para Guardia
import { useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";

const rolColors = {
  administrador: '#0d47a1',   // azul oscuro
  guardia: '#0288d1',         // celeste/azul
  estudiante: '#2e7d32',      // verde
  funcionario: '#e65100',     // naranjo fuerte
  académico: '#6a1b9a'        // púrpura
};

function rolStyle(rol) {
  const color = rolColors[rol?.toLowerCase().trim()] || '#6c757d';
  return {
    backgroundColor: color,
    color: '#fff',
    padding: '4px 8px',
    borderRadius: 12,
    display: 'inline-block',
    fontWeight: 'bold',
    textTransform: 'capitalize'
  };
}

const Users = () => {
  const { user: authUser } = useAuth();
  const { users, fetchUsers } = useGetUser();
  const { handleDeleteUser } = useDeleteUser(fetchUsers);
  const { handleCreateUser } = useCreateUser(fetchUsers);          // Admin
  const { handleCreateUserGuard } = useCreateUserGuard(fetchUsers); // Guardia
  const { handleEditUser } = useEditUser(fetchUsers);              // Admin
  const { handleEditUserGuard } = useEditUserGuard(fetchUsers);    // Guardia

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="users-page">
      <div className="users-header">
        <h2>Lista de Usuarios</h2>
        {authUser?.rol === 'Administrador' && (
          <button className="users-addbtn" onClick={() => handleCreateUser()}>
            Añadir Guardia
          </button>
        )}
        {authUser?.rol === 'Guardia' && (
          <button className="users-addbtn" onClick={() => handleCreateUserGuard()}>
            Añadir Usuario
          </button>
        )}
      </div>

      <table className="users-table">
        <thead>
          <tr>
            <th>Rut</th>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Email</th>
            <th>Rol</th>
            <th>Teléfono</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(users) && users.length > 0 ? (
            users.map((u) => (
              <tr key={u.id}>
                <td>{u.rut}</td>
                <td>{u.nombre}</td>
                <td>{u.apellido}</td>
                <td>{u.email}</td>
                <td>
                  <span style={rolStyle(u.rol)}>
                    {u.rol}
                  </span>
                </td>
                <td>{u.telefono}</td>
                <td>
                  <button className="delete" onClick={() => handleDeleteUser(u.id)}>Eliminar</button>
                  {authUser?.rol === 'Administrador' && (
                    <button
                      className="edit"
                      style={{ marginLeft: "8px" }}
                      onClick={() => handleEditUser(u.id, u)}
                    >
                      Editar
                    </button>
                  )}
                  {authUser?.rol === 'Guardia' && (
                    <button
                      className="edit"
                      style={{ marginLeft: "8px" }}
                      onClick={() => handleEditUserGuard(u.id, u)}
                    >
                      Editar
                    </button>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7">No hay usuarios disponibles</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Users;
