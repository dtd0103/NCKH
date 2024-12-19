import express from "express";
import brandController from "../controllers/brandController.js";
import authenticateJWT from "../services/jwtAuth.js";
import authenticateAdminJWT from "../services/adminAuth.js";

const brandRouter = express.Router();

brandRouter.get("/brands", brandController.getAllBrand);
brandRouter.get("/brands/:name", brandController.getBrand);
brandRouter.post("/brands", authenticateAdminJWT, brandController.createBrand);
brandRouter.put("/brands", authenticateAdminJWT, brandController.updateBrand);
brandRouter.delete(
    "/brands/:id",
    authenticateAdminJWT,
    brandController.deleteBrand
);

export default brandRouter;
