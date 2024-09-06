import express from "express";
import subCategoryController from "../controllers/subCategoryController.js";

const subCategoryRouter = express.Router();

subCategoryRouter.get(
    "/subcategories",
    subCategoryController.getAllSubCategory
);
subCategoryRouter.get(
    "/subcategories/:name",
    subCategoryController.getSubCategory
);
subCategoryRouter.post(
    "/subcategories",
    subCategoryController.createSubCategory
);
subCategoryRouter.put(
    "/subcategories",
    subCategoryController.updateSubCategory
);
subCategoryRouter.delete(
    "/subcategories/:id",
    subCategoryController.deleteSubCategory
);

export default subCategoryRouter;
