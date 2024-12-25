import express from "express";
import brandController from "../controllers/brandController.js";
import authenticateJWT from "../services/jwtAuth.js";
import authenticateAdminJWT from "../services/adminAuth.js";
import { uploadBrand } from "../services/imgUpload.js";

const brandRouter = express.Router();

brandRouter.get("/brands", brandController.getAllBrand);
brandRouter.get("/brand/:name", brandController.getBrand);
brandRouter.post(
    "/brand",
    authenticateAdminJWT,
    uploadBrand,
    brandController.createBrand
);
brandRouter.put(
    "/brand/:id",
    authenticateAdminJWT,
    uploadBrand,
    brandController.updateBrand
);
brandRouter.delete(
    "/brand/:id",
    authenticateAdminJWT,
    brandController.deleteBrand
);

export default brandRouter;
