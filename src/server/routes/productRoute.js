import express from "express";
import productController from "../controllers/productController.js";

const productRouter = express.Router();

productRouter.get("/products", productController.getAllProduct);
productRouter.get("/product/id/:id", productController.getProductById);
productRouter.get("/product/name/:name", productController.getProduct);
productRouter.get(
    "/product/category/:id",
    productController.getProductByCategoryId
);
productRouter.post("/product", productController.createProduct);
productRouter.put("/product", productController.updateProduct);
productRouter.delete("/product/:id", productController.deleteProduct);

productRouter.post("/product/view", productController.productView);

export default productRouter;
