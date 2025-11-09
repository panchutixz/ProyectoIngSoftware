import { Router } from "express";
import authRoutes from "./auth.routes.js";
import bikerackRoutes from "./bikeRack.routes.js";
import profileRoutes from "./profile.routes.js";
import userRoutes from "./user.routes.js";
import historialRoutes from "./historial.routes.js";

export function routerApi(app) {
  const router = Router();
  app.use("/api", router);
  router.use("/auth", authRoutes);
  router.use("/profile", profileRoutes);
  router.use("/users", userRoutes);
  app.use("/api/bicicletero", bikerackRoutes); 
  router.use("/historial", historialRoutes);
}

