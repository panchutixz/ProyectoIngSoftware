import { Router } from "express";
import { createBikeRack, getAllBikeRacks, getBikeRackById, updateBikeRack, deleteBikeRack, asignarGuardia} from "../controllers/bicicletero.controller.js";

const router = Router();

router.post("/", createBikeRack);
router.get("/", getAllBikeRacks);
router.get("/:id_bicicletero", getBikeRackById);
router.patch("/:id_bicicletero", updateBikeRack);
router.delete("/:id_bicicletero", deleteBikeRack);
router.post("/:id_bicicletero/asignarGuardia", asignarGuardia);
router.post("/")


export default router;