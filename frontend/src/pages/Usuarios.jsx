import "@styles/usuarios.css";
import useGetUser  from "@hooks/usuario/useGetUser.jsx";
import useDeleteUser from "@hooks/usuario/useDeleteUser.jsx";
import useCreateUser from "@hooks/usuario/useCreateUser.jsx";
import { useEffect } from "react";

const Users = () => {
    const { users, fetchUsers } = useGetUser();
    const { handleDeleteUser } = useDeleteUser(fetchUsers);
    const { handleCreateUser } = useCreateUser(fetchUsers);

    
    useEffect(() => {
        fetchUsers();
    },[]);

    return (
        <div className="users-page">
            <div className = "users-header">
            <h2>Lista de Usuarios</h2>   
            <button className="users-addbtn" onClick={() => handleCreateUser()}>Añadir</button>
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
                    users.map((user) => (
                        <tr key={user.id}>
                            <td>{user.rut}</td>
                            <td>{user.nombre}</td>
                            <td>{user.apellido}</td>
                            <td>{user.email}</td>
                            <td>{user.rol}</td>
                            <td>{user.telefono}</td>
                            <td>
                                <button className="delete" onClick={() => handleDeleteUser(user.id)}>Eliminar</button>
                                
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="6">No hay usuarios disponibles</td>
                    </tr>
                )

                }
            </tbody>
        </table>
    </div>
    )
}

export default Users;