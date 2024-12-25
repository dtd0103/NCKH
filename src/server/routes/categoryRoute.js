import express from "express";
import categoryController from "../controllers/categoryController.js";
import authenticateJWT from "../services/jwtAuth.js";
import authenticateAdminJWT from "../services/adminAuth.js";
import { uploadCategory } from "../services/imgUpload.js";

const categoryRouter = express.Router();

categoryRouter.get("/categories", categoryController.getAllCategory);
categoryRouter.get("/category/:name", categoryController.getCategory);
categoryRouter.post(
    "/category",
    authenticateAdminJWT,
    uploadCategory,
    categoryController.createCategory
);
categoryRouter.put(
    "/category/:id",
    authenticateAdminJWT,
    uploadCategory,
    categoryController.updateCategory
);
categoryRouter.delete(
    "/category/:id",
    authenticateAdminJWT,
    categoryController.deleteCategory
);

export default categoryRouter;
