import "@styles/profile.css";
import axios from "axios";
import { useState } from "react";

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

const ProfileCard = ({ user, setUser, fetchProfile }) => {
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const getImageUrl = (path) => `${BASE_URL.replace("/api", "")}${path}`;

  const [profileImage, setProfileImage] = useState(
    user.foto_perfil
      ? getImageUrl(user.foto_perfil)
      : roleImages[user.rol?.toLowerCase()] || defaultPic
  );

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("profileImage", file);

    try {
      const res = await axios.post(`${BASE_URL}/users/profile-image`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Foto actualizada correctamente");

      const nuevaRuta = res.data.path;
      setProfileImage(getImageUrl(nuevaRuta));

      // Refresca perfil desde backend
      const updatedProfile = await fetchProfile();
      setUser(updatedProfile?.data?.userData || user);
    } catch (err) {
      console.error("Error al subir imagen:", err);
      alert("Error al actualizar la foto");
    }
  };

  return (
    <div className="profile-card">
      <h1 className="profile-header"><strong>Perfil de Usuario</strong></h1>
      <div className="profile-content">
        <div className="profile-image">
          <img src={profileImage} alt={`${user.nombre}'s profile`} />
        </div>
        <div className="profile-info">
          <p><strong>Nombre:</strong> {user.nombre} {user.apellido}</p>
          <p><strong>Correo:</strong> {user.email}</p>
          <p><strong>Rol:</strong> {user.rol || "No especificado"}</p>

          <button
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            onClick={() => document.getElementById("fileInput").click()}
          >
            Cambiar foto de perfil
          </button>
          <input
            type="file"
            id="fileInput"
            accept="image/*"
            className="hidden"
            onChange={handleFileUpload}
          />
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
