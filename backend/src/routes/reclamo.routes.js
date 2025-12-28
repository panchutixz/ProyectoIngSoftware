import { Router } from "express";
import { crearReclamo, obtenerMisReclamos, actualizarReclamo, eliminarReclamo, obtenerBicicletasUsuario } from "../controllers/reclamo.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/", authMiddleware, crearReclamo);
router.get("/mis-reclamos", authMiddleware, obtenerMisReclamos);
router.get("/mis-bicicletas", authMiddleware, obtenerBicicletasUsuario);
router.put("/:id", authMiddleware, actualizarReclamo);
router.delete("/:id", authMiddleware, eliminarReclamo);

export default router;


