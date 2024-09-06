import express from "express";
import productController from "../controllers/productController.js";

const productRouter = express.Router();

productRouter.get("/products", productController.getAllProduct);
productRouter.get("/product/:name", productController.getProduct);
productRouter.post("/product", productController.createProduct);
productRouter.put("/product", productController.updateProduct);
productRouter.delete("/product/:id", productController.deleteProduct);

export default productRouter;
