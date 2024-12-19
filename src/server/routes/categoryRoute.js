import express from "express";
import categoryController from "../controllers/categoryController.js";
import authenticateJWT from "../services/jwtAuth.js";
import authenticateAdminJWT from "../services/adminAuth.js";

const categoryRouter = express.Router();

categoryRouter.get("/categories", categoryController.getAllCategory);
categoryRouter.get("/categories/:name", categoryController.getCategory);
categoryRouter.post(
    "/categories",
    authenticateAdminJWT,
    categoryController.createCategory
);
categoryRouter.put(
    "/categories",
    authenticateAdminJWT,
    categoryController.updateCategory
);
categoryRouter.delete(
    "/categories/:id",
    authenticateAdminJWT,
    categoryController.deleteCategory
);

export default categoryRouter;
