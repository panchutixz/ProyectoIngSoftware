import { Router } from "express";
import { registerBicycle, getBicycle , getUserBicycles, retirarBicycle  } from "../controllers/bicicletas.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/bicicleta", registerBicycle);
router.get("/obtener", authMiddleware, getBicycle);
router.get("/usuario/:rut", getUserBicycles);
router.delete("/retirar", authMiddleware, retirarBicycle);



export default router;