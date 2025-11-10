import "@styles/usuarios.css";
import useGetUser  from "@hooks/usuario/useGetUser.jsx";
import useDeleteUser from "@hooks/usuario/useDeleteUser.jsx";
import useCreateUser from "@hooks/usuario/useCreateUser.jsx";
import { useEffect } from "react";


const Users = () => {
    const { users, fetchUsers } = useGetUser();
    const {handleDeleteUser} = useDeleteUser(fetchUsers);
    const {handleCreateUser} = useCreateUser(fetchUsers);

    
    /* eslint-disable react-hooks/exhaustive-deps */
    useEffect(() => {
        fetchUsers();
    },[]);

    return (
        <div className="users-page">
            <div className = "users-header">
            <h2>Lista de Usuarios</h2>   
            <button className="users-addbtn" onClick={()=> handleCreateUser()}>Añadir</button>
            </div>

            <table className="users-table">
                <thead>
                    <tr>
                        <th>Rut</th>
                        <th>Nombre</th>
                        <th>Apellido</th>
                        <th>Email</th>
                        <th>Rol</th>
                    </tr>
                </thead>
            <tbody>
                {Array.isArray(users) && users.length > 0 ? (
                    users.map((user) => (
                        <tr key={participant.id}>
                            <td>{participant.rut}</td>
                            <td>{participant.nombre}</td>
                            <td>{participant.apellido}</td>
                            <td>{participant.email}</td>
                            <td>{participant.rol}</td>
                            <td>
                                <button className="delete" onClick={()=> handleDeleteUser(user.id)}>Eliminar</button>
                                
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="5">No hay usuarios disponibles</td>
                    </tr>
                )

                }
            </tbody>
        </table>
    </div>
    )
}

export default Users;