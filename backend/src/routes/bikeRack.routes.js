import { Router } from "express";
import { createBikeRack } from "../controllers/bicicletero.controller.js";

const router = Router();

router.post("/bicicletero", createBikeRack);


export default router;