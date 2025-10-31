import { Router } from "express";
import { login, register } from "../controllers/auth.controller.js";
import { registerBicycle } from "../controllers/bicicletas.controller.js";
const router = Router();


router.post("/login", login);
router.post("/register", register);
router.post("/register/bicicletas", registerBicycle);

export default router;
