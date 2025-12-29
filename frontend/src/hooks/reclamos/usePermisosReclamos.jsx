import { useMemo } from 'react';

export const usePermisosReclamos = () => {
  const user = JSON.parse(sessionStorage.getItem("usuario")) || null;
  const userRole = user?.rol || user?.role || "";
  const userRut = user?.rut || "";
  const userName = user?.nombre || user?.name || "";

  const permisos = useMemo(() => {
    const esAdmin = userRole?.toLowerCase() === "administrador" || userRole?.toLowerCase() === "admin";
    const esGuardia = userRole?.toLowerCase() === "guardia";
    const esEstudiante = userRole?.toLowerCase() === "estudiante";
    const esAcademico = userRole?.toLowerCase() === "académico" || userRole?.toLowerCase() === "academico";
    const esFuncionario = userRole?.toLowerCase() === "funcionario";
    
    const puedeCrearReclamo = esEstudiante || esAcademico || esFuncionario;
    const puedeVerTodos = esAdmin || esGuardia;
    
    return {
      esAdmin,
      esGuardia,
      esEstudiante,
      esAcademico,
      esFuncionario,
      userRole,
      userRut,
      userName,
      puedeCrearReclamo,
      puedeVerTodos,
      puedeContestar: esAdmin || esGuardia,
      puedeEliminar: esAdmin || (puedeCrearReclamo && !esGuardia),
      puedeFiltrarRUT: esAdmin || esGuardia,
      tituloPagina: puedeVerTodos 
        ? "Reclamos del Sistema" 
        : puedeCrearReclamo 
          ? "Mis Reclamos" 
          : "Reclamos"
    };
  }, [userRole, userRut, userName]);

  return permisos;
};

export default usePermisosReclamos;