import { Router } from "express";
import { authMiddleware } from "../../middleware/authMiddleware.js";
import { optionalAuthMiddleware } from "../../middleware/optionalAuthMiddleware.js";
import {
  askAssistantController,
  getAssistantHistoryController,
} from "./assistant.controller.js";

export const assistantRouter = Router();

assistantRouter.post("/ask", optionalAuthMiddleware, askAssistantController);
assistantRouter.get("/history", authMiddleware, getAssistantHistoryController);