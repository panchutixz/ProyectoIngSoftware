import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { getUsers, getUserById, createUser, deleteUserById, updateUserById } from "../controllers/user.controller.js";
import { getUsers, getUserById, createUser, updateUserById ,deleteUserById, updateUserData } from "../controllers/user.controller.js";ec29eab9ff6119951f25eddf3e5a319dc7fe49aa

const router = Router();

router.get("/", authMiddleware, getUsers);
router.get("/:id", authMiddleware, getUserById);
router.post("/", createUser);
router.put("/:id", authMiddleware, updateUserById);
router.delete("/:id", authMiddleware, deleteUserById);
router.put("/actualizar/:rut", authMiddleware, updateUserData);
export default router;
