import { Router } from "express";
import { authMiddleware } from "../../middleware/authMiddleware.js";
import {
  loginController,
  meController,
  registerController,
  updateProfileController,
} from "./auth.controller.js";

export const authRouter = Router();

authRouter.post("/register", registerController);
authRouter.post("/login", loginController);
authRouter.get("/me", authMiddleware, meController);
authRouter.patch("/profile", authMiddleware, updateProfileController);