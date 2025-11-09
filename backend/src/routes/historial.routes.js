import express from "express";
import { getHistoryByUser } from "../controllers/historial.controller.js";

const router = express.Router();

// Obtener historial del usuario por RUT
router.get("/usuario/:id", getHistoryByUser);

export default router;