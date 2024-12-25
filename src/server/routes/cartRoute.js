import express from "express";
import cartController from "../controllers/cartController.js";
import authenticateJWT from "../services/jwtAuth.js";

const cartRouter = express.Router();

cartRouter.get("/cart/:customerId", authenticateJWT, cartController.getCart);
cartRouter.post("/cart", authenticateJWT, cartController.addToCart);
cartRouter.put("/cart", authenticateJWT, cartController.updateCartItem);
cartRouter.delete(
    "/cart/item/:id",
    authenticateJWT,
    cartController.removeCartItem
);
cartRouter.get(
    "/cart/:cartId/details",
    authenticateJWT,
    cartController.getCartDetails
);
cartRouter.delete(
    "/cart/:cartId/clear",
    authenticateJWT,
    cartController.clearCart
);

export default cartRouter;
