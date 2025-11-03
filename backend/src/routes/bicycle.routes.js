import { Router } from "express";
import { registerBicycle} from "../controllers/bicicletas.controller.js";

const router = Router();

router.post("/bicicleta", registerBicycle);



export default router;