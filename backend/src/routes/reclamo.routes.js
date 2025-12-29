import { Router } from "express";
import { crearReclamo, obtenerMisReclamos, actualizarReclamo, eliminarReclamo, obtenerBicicletasUsuario, contestarReclamo, cambiarEstadoReclamo, buscarReclamos, obtenerReclamoPorId } from "../controllers/reclamo.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/", authMiddleware, crearReclamo);
router.get("/mis-reclamos", authMiddleware, obtenerMisReclamos);
router.get("/mis-bicicletas", authMiddleware, obtenerBicicletasUsuario);
router.put("/:id", authMiddleware, actualizarReclamo);
router.delete("/:id", authMiddleware, eliminarReclamo);
router.get("/buscar", authMiddleware, buscarReclamos);
router.get("/:id", authMiddleware, obtenerReclamoPorId);
router.put("/:id/contestar", authMiddleware, contestarReclamo);
router.put("/:id/estado", authMiddleware, cambiarEstadoReclamo);

export default router;


