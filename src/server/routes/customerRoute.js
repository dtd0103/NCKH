import express from "express";
import customerController from "../controllers/customerController.js";

const customerRouter = express.Router();

customerRouter.post("/customer/register", customerController.customerRegister);
customerRouter.post("/customer/login", customerController.customerLogin);
customerRouter.get("/customer/:username", customerController.getCustomer);
customerRouter.put("/customer", customerController.updateCustomer);
customerRouter.delete("/customer/:id", customerController.deleteCustomer);

export default customerRouter;
