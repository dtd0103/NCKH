import express from "express";
import productController from "../controllers/productController.js";
import authenticateJWT from "../services/jwtAuth.js";
import authenticateAdminJWT from "../services/adminAuth.js";

const productRouter = express.Router();

productRouter.get("/products", productController.getAllProduct);
productRouter.get("/product/id/:id", productController.getProductById);
productRouter.get("/product/name/:name", productController.getProduct);
productRouter.get(
    "/product/category/:id",
    productController.getProductByCategoryId
);
productRouter.post(
    "/product/create",
    authenticateAdminJWT,
    productController.createProduct
);
productRouter.put(
    "/product",
    authenticateAdminJWT,
    productController.updateProduct
);
productRouter.delete(
    "/product/:id",
    authenticateAdminJWT,
    productController.deleteProduct
);
productRouter.post("/product/view", productController.productView);

export default productRouter;
