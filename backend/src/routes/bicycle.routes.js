import { Router } from "express";
import { registerBicycle, loginBicycle, getBicycle } from "../controllers/bicicletas.controller.js";

const router = Router();

router.post("/bicicleta", registerBicycle);


export default router;