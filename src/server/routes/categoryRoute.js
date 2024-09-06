import express from "express";
import categoryController from "../controllers/categoryController.js";

const categoryRouter = express.Router();

categoryRouter.get("/categories", categoryController.getAllCategory);
categoryRouter.get("/categories/:name", categoryController.getCategory);
categoryRouter.post("/categories", categoryController.createCategory);
categoryRouter.put("/categories", categoryController.updateCategory);
categoryRouter.delete("/categories/:id", categoryController.deleteCategory);

export default categoryRouter;
