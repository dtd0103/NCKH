import express from "express";

import orderController from "../controllers/orderController.js";

const orderRouter = express.Router();

orderRouter.get("/orders", orderController.getAllOrder);
orderRouter.get("/order/:id", orderController.getOrder);
orderRouter.post("/order/create", orderController.orderCreate);
orderRouter.put("/order", orderController.orderUpdate);
orderRouter.delete("/order/:id", orderController.orderDelete);
orderRouter.get("/orders/customer/:customerId",orderController.getOrdersByCusId);

export default orderRouter;
