import express from "express";
import orderController from "../controllers/orderController.js";
import authenticateJWT from "../services/jwtAuth.js";
import authenticateAdminJWT from "../services/adminAuth.js";

const orderRouter = express.Router();

orderRouter.get("/orders", authenticateAdminJWT, orderController.getAllOrder);
orderRouter.get("/order/:id", orderController.getOrder);
orderRouter.post("/order/create", authenticateJWT, orderController.orderCreate);
orderRouter.put("/order", orderController.orderUpdate);
orderRouter.delete(
    "/order/:id",
    authenticateAdminJWT,
    orderController.orderDelete
);
orderRouter.get(
    "/orders/customer/:customerId",
    orderController.getOrdersByCusId
);
orderRouter.get("/order/:orderId/details", orderController.getOrderDetails);

export default orderRouter;
