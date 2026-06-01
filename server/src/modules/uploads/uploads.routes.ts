import { Router } from "express";
import { authMiddleware } from "../../middleware/authMiddleware.js";
import { uploadAvatarController } from "./uploads.controller.js";
import { avatarUpload } from "./upload.middleware.js";

export const uploadsRouter = Router();

uploadsRouter.post(
  "/avatar",
  authMiddleware,
  avatarUpload.single("avatar"),
  uploadAvatarController
);