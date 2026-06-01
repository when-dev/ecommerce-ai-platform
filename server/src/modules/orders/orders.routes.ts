import { Router } from "express";
import { authMiddleware } from "../../middleware/authMiddleware.js";
import {
  createOrderController,
  getMyOrdersController,
  payOrderController
} from "./orders.controller.js";

export const ordersRouter = Router();

ordersRouter.post("/", authMiddleware, createOrderController);
ordersRouter.get("/my", authMiddleware, getMyOrdersController);
ordersRouter.post("/:id/pay", authMiddleware, payOrderController);