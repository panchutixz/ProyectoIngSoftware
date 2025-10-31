import { Router } from "express";
import { createBikeRack } from "../controllers/bicicletero.controller.js";

const router = Router();

router.post("/register/bicicletas", createBikeRack);
router.get("/", getAllBikeRacks);
router.get("/:id", getBikeRackById);
router.delete("/:id", deleteBikeRack);


export default router;