import { Router } from "express";
import { login, register } from "../controllers/auth.controller.js";
import { registerBicycle } from "../controllers/bicicletas.controller.js";
import { createBikeRack, getAllBikeRacks, getBikeRackById, deleteBikeRack } from "../controllers/bicicletero.controller.js";
const router = Router();


router.post("/login", login);
router.post("/register", register);
router.post("/register/bicicletas", registerBicycle);
router.post("/create/bicicletero", createBikeRack);
router.get("/getAll/bicicletero", getAllBikeRacks);
router.get("/get/bicicletero", getBikeRackById);
router.delete("/delete/bicicletero", deleteBikeRack);



export default router;
