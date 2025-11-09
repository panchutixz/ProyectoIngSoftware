import { Router } from "express";
import { registerBicycle, getUserBicycles, getUserHistory, updateUserData,} from "../controllers/bicicletas.controller.js";

const router = Router();

router.post("/bicicleta", registerBicycle);
router.get("/usuario/:rut", getUserBicycles);
router.get("/historial/:rut", getUserHistory);
router.put("/usuario/:rut", updateUserData);



export default router;