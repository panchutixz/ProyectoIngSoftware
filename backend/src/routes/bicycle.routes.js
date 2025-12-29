import { Router } from "express";
import { registerBicycle, getBicycle , getUserBicycles, retirarBicycle, reIngresoBicycle, eliminarBicycle, editarBicycle,moverBicycle,marcarOlvidadas } from "../controllers/bicicletas.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/bicicleta", authMiddleware,registerBicycle);
router.patch("/reingreso", authMiddleware,reIngresoBicycle);
router.get("/obtener", authMiddleware, getBicycle);
router.get("/usuario/:rut", getUserBicycles);
router.delete("/retirar", authMiddleware, retirarBicycle);
router.delete("/eliminar", authMiddleware, eliminarBicycle);
router.patch("/editar", authMiddleware, editarBicycle);
router.put("/mover", authMiddleware, moverBicycle);
router.put("/marcarOlvidadas", authMiddleware, marcarOlvidadas);



export default router;