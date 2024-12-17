import express from "express";
import cartController from "../controllers/cartController.js";

const cartRouter = express.Router();

// Cart routes
cartRouter.post("/cart/create", cartController.createCart);
cartRouter.get("/cart/:cartId", cartController.getCart);
cartRouter.put("/cart/:cartId", cartController.updateCart);
cartRouter.delete("/cart/:cartId", cartController.deleteCart);

// Cart item routes
cartRouter.post("/cart/:cartId/item", cartController.addItemToCart);
cartRouter.get("/cart/:cartId/items", cartController.getCartItems);
cartRouter.put("/cart/:cartId/item/:itemId", cartController.updateCartItem);
cartRouter.delete("/cart/:cartId/item/:itemId", cartController.deleteCartItem);

export default cartRouter;
