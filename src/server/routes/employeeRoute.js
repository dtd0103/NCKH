import employeeController from "../controllers/employeeController.js";
import express from "express";
import authenticateJWT from "../services/jwtAuth.js";
import authenticateAdminJWT from "../services/adminAuth.js";

const employeeRouter = express.Router();

employeeRouter.get("/employees", employeeController.getAllEmployee);
employeeRouter.get("/employee/:username", employeeController.getEmployee);
employeeRouter.post("/employee/create", employeeController.employeeCreate);
employeeRouter.post("/employee/login", employeeController.employeeLogin);
employeeRouter.put(
    "/employee",
    authenticateAdminJWT,
    employeeController.employeeUpdate
);
employeeRouter.delete(
    "/employee/:id",
    authenticateAdminJWT,
    employeeController.employeeDelete
);

export default employeeRouter;
