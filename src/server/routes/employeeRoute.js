import employeeController from "../controllers/employeeController.js";
import express from "express";

const employeeRouter = express.Router();

employeeRouter.get("/employees", employeeController.getAllEmployee);
employeeRouter.get("/employee/:username", employeeController.getEmployee);
employeeRouter.post("/employee/create", employeeController.employeeCreate);
employeeRouter.post("/employee/login", employeeController.employeeLogin);
employeeRouter.put("/employee", employeeController.employeeUpdate);
employeeRouter.delete("/employee/:id", employeeController.employeeDelete);

export default employeeRouter;
