import express from "express";
import { getHistoryByUser, getAllHistorial } from "../controllers/historial.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";


const router = express.Router();

//obtener todo el historial (solo admin y guardia)
router.get("/", authMiddleware, getAllHistorial);

//obtener historial del usuario por rut
router.get("/:rut", authMiddleware, getHistoryByUser);
export default router;