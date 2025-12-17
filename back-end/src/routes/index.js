import { Router } from "express";
import healthRouter from "./health.js";
import placesRouter from "./places.js";
import menusRouter from "./menus.js";
import customersRouter from "./customers.js";
import couriersRouter from "./couriers.js";
import ordersRouter from "./orders.js";

const router = Router();

router.use("/health", healthRouter);
router.use("/", placesRouter);
router.use("/", menusRouter);
router.use("/", customersRouter);
router.use("/", couriersRouter);
router.use("/", ordersRouter);

export default router;
