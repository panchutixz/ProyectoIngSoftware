import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { getUsers, getUserById, createUser, updateUserById ,deleteUserById, updateUserData } from "../controllers/user.controller.js";

const router = Router();

router.get("/", getUsers);
router.get("/:id", getUserById);
router.post("/", createUser);
router.put("/:id", updateUserById);
router.delete("/:id", deleteUserById);
router.put("/actualizar/:rut", updateUserData);
export default router;