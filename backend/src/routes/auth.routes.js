import { Router } from "express";
import { login, register } from "../controllers/auth.controller.js";
import { registerBicycle, getBicycle, retirarBicycle, getUserBicycles, reIngresoBicycle } from "../controllers/bicicletas.controller.js";
import { getHistoryByUser } from "../controllers/historial.controller.js";
import { createBikeRack, getAllBikeRacks, getBikeRackById, updateBikeRack, deleteBikeRack, asignarGuardia, desasignarGuardia, getCapacity} from "../controllers/bicicletero.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";


const router = Router();

router.post("/login", login);
router.post("/register", register);

router.patch("/reIngreso/bicicletas", reIngresoBicycle);
router.post("/register/bicicletas", registerBicycle);
router.get("/obtener/bicicletas", authMiddleware, getBicycle);
router.delete("/retirar/bicicletas", authMiddleware, retirarBicycle);
router.post("/create/bicicletero", authMiddleware, createBikeRack);
router.get("/getAll/bicicletero", getAllBikeRacks);
router.get("/get/bicicletero", getBikeRackById);
router.patch("/update/bicicletero", authMiddleware, updateBikeRack);
router.delete("/delete/bicicletero", authMiddleware, deleteBikeRack);

router.post("/asignar/bicicletero", authMiddleware, asignarGuardia);
router.post("/historial/rut", authMiddleware, getHistoryByUser);
router.get("/usuario/:rut", authMiddleware, getUserBicycles);
router.patch("/desasignar/bicicletero", authMiddleware, desasignarGuardia);
router.get("/getCapacity/bicicletero", getCapacity);


export default router;
