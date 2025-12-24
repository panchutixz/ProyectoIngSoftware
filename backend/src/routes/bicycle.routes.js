import { Router } from "express";
import { registerBicycle, getBicycle , getUserBicycles, retirarBicycle, reIngresoBicycle, marcarOlvidadas } from "../controllers/bicicletas.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/bicicleta", registerBicycle);
router.patch("/reingreso", reIngresoBicycle);
router.get("/obtener", authMiddleware, getBicycle);
router.get("/usuario/:rut", getUserBicycles);
router.delete("/retirar", authMiddleware, retirarBicycle);
router.put("/marcarOlvidadas", authMiddleware, marcarOlvidadas);



export default router;