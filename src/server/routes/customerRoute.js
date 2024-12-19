import express from "express";
import customerController from "../controllers/customerController.js";
import authenticateJWT from "../services/jwtAuth.js";
import authenticateAdminJWT from "../services/adminAuth.js";

const customerRouter = express.Router();

customerRouter.post("/customer/register", customerController.customerRegister);
customerRouter.post("/customer/login", customerController.customerLogin);
customerRouter.post("/customer/logout", customerController.customerLogout);
customerRouter.get("/customer/:username", customerController.getCustomer);
customerRouter.put(
    "/customer",
    authenticateJWT,
    customerController.updateCustomer
);
customerRouter.delete(
    "/customer/:id",
    authenticateJWT,
    customerController.deleteCustomer
);

export default customerRouter;
