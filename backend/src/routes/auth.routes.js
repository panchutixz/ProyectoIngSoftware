import { Router } from "express";
import { login, register } from "../controllers/auth.controller.js";
import { registerBicycle, getBicycle, retirarBicycle } from "../controllers/bicicletas.controller.js";
import { createBikeRack, getAllBikeRacks, getBikeRackById, updateBikeRack, deleteBikeRack} from "../controllers/bicicletero.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
const router = Router();


router.post("/login", login);
router.post("/register", register);
router.post("/register/bicicletas", registerBicycle);
router.get("/obtener/bicicletas", getBicycle, authMiddleware);
router.delete("/retirar/bicicletas", retirarBicycle);
router.post("/create/bicicletero", createBikeRack);
router.get("/getAll/bicicletero", getAllBikeRacks);
router.get("/get/bicicletero", getBikeRackById);
router.patch("/update/bicicletero", updateBikeRack);
router.delete("/delete/bicicletero", deleteBikeRack);



export default router;
