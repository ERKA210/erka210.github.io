import { Router } from "express";
import healthRouter from "./health.js";
import authRouter from "./auth.js";
import deliveryCartRouter from "./delivery-cart.js";
import activeOrderRouter from "./active-order.js";
import ratingsRouter from "./ratings.js";
import placesRouter from "./places.js";
import menusRouter from "./menus.js";
import customersRouter from "./customers.js";
import couriersRouter from "./couriers.js";
import ordersRouter from "./orders.js";

const router = Router();

router.use("/health", healthRouter);
router.use("/", authRouter);
router.use("/", deliveryCartRouter);
router.use("/", activeOrderRouter);
router.use("/", ratingsRouter);
router.use("/", placesRouter);
router.use("/", menusRouter);
router.use("/", customersRouter);
router.use("/", couriersRouter);
router.use("/", ordersRouter);

export default router;
