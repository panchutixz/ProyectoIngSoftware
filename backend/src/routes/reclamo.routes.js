import { Router } from "express";
import { crearReclamo, obtenerMisReclamos, actualizarReclamo, eliminarReclamo } from "../controllers/reclamo.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/", authMiddleware, crearReclamo);
router.get("/mis-reclamos", authMiddleware, obtenerMisReclamos);
router.put("/:id", authMiddleware, actualizarReclamo);
router.delete("/:id", authMiddleware, eliminarReclamo);


export default router;
