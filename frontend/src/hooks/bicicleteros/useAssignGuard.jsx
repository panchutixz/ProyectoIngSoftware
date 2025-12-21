import { assignGuardToBikeRack, unassignGuardFromBikeRack } from "@services/bicicleteros.service.js";

export const useAssignGuard = (refreshBikeRacks) => {
  const handleAssignGuard = async (id_bicicletero, id_guardia) => {
    try {
      if (!id_guardia) {
        await unassignGuardFromBikeRack(id_bicicletero);
      } else {
        await assignGuardToBikeRack(id_bicicletero, id_guardia);
      }
      if (refreshBikeRacks) refreshBikeRacks();
    } catch (error) {
      console.error("Error al asignar/desasignar guardia:", error);
    }
  };

  return { handleAssignGuard };
};