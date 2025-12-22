import "@styles/profile.css";
import profilePic from "@assets/gatodosekai.png";

const ProfileCard = ({ user }) => {
  return (
    <div className="profile-card">
      <h1 className="profile-header"><strong>Perfil de Usuario</strong></h1>
      <div className="profile-content">
        <div className="profile-image">
          <img src={profilePic} alt={`${user.nombre}'s profile`} />
        </div>
        <div className="profile-info">
          <p>
            <strong>Nombre:</strong> {user.nombre} {user.apellido}
          </p>
          <p>
            <strong>Correo:</strong> {user.email}
          </p>
          <p>
            <strong>Rol:</strong> {user.rol || "No especificado"} 
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;