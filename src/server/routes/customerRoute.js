import express from "express";
import customerController from "../controllers/customerController.js";

const customerRouter = express.Router();

customerRouter.post("/customer/register", customerController.customerRegister);
customerRouter.post("/customer/login", customerController.customerLogin);

export default customerRouter;
