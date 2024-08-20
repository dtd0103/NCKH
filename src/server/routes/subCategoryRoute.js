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
    "/subcategories/:name",
    subCategoryController.updateSubCategory
);
subCategoryRouter.delete(
    "/subcategories/:name",
    subCategoryController.deleteSubCategory
);

export default subCategoryRouter;
