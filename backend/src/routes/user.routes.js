import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { getUsers, getUserById, createUser, deleteUserById, updateUserById } from "../controllers/user.controller.js";

const router = Router();

router.get("/", authMiddleware, getUsers);
router.get("/:id", authMiddleware, getUserById);
router.post("/", createUser);
router.put("/:id", authMiddleware, updateUserById);
router.delete("/:id", authMiddleware, deleteUserById);

export default router;
