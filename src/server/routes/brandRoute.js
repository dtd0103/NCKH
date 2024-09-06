import express from "express";
import brandController from "../controllers/brandController.js";

const brandRouter = express.Router();

brandRouter.get("/brands", brandController.getAllBrand);
brandRouter.get("/brands/:name", brandController.getBrand);
brandRouter.post("/brands", brandController.createBrand);
brandRouter.put("/brands", brandController.updateBrand);
brandRouter.delete("/brands/:id", brandController.deleteBrand);

export default brandRouter;
