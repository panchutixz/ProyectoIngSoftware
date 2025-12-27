import "@styles/profile.css";

// Importa las imágenes por rol
import academicoPic from "@assets/roles/academico.png";
import administradorPic from "@assets/roles/administrador.png";
import estudiantePic from "@assets/roles/estudiante.png";
import funcionarioPic from "@assets/roles/funcionario.png";
import guardiaPic from "@assets/roles/guardia.png";
import defaultPic from "@assets/gatodosekai.png";

const roleImages = {
  academico: academicoPic,
  administrador: administradorPic,
  estudiante: estudiantePic,
  funcionario: funcionarioPic,
  guardia: guardiaPic,
};

const ProfileCard = ({ user }) => {
  // Si el usuario tiene rol, se usa la imagen correspondiente, si no, se usa la iamgen default
  const profileImage = roleImages[user.rol?.toLowerCase()] || defaultPic;

  return (
    <div className="profile-card">
      <h1 className="profile-header"><strong>Perfil de Usuario</strong></h1>
      <div className="profile-content">
        <div className="profile-image">
          <img src={profileImage} alt={`${user.nombre}'s profile`} />
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
