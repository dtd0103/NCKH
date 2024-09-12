import express from "express";

import orderController from "../controllers/orderController.js";

const orderRouter = express.Router();

orderRouter.get("/orders", orderController.getAllOrder);
orderRouter.get("/order/:id", orderController.getOrder);
orderRouter.post("/orders", orderController.orderCreate);
orderRouter.put("/order", orderController.orderUpdate);
orderRouter.delete("/order/:id", orderController.orderDelete);

export default orderRouter;
