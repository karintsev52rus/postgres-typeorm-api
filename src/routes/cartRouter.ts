import * as express from "express";
import { cartController } from "../controllers/cartController";
import {
  userAuthMiddleware,
  userIdMiddleware,
} from "../middlewares/authMiddleware";

export const cartRouter = express.Router();

const cartRoutes = {
  addProduct: "/update_cart",
  getCart: "/get_cart/:id",
  deleteProduct: "/delete",
  clear: "/clear",
};

cartRouter.get(
  cartRoutes.getCart,
  userAuthMiddleware,
  userIdMiddleware,
  cartController.getCart
);
cartRouter.put(
  cartRoutes.addProduct,
  userAuthMiddleware,
  userIdMiddleware,
  cartController.updateCart
);
cartRouter.delete(
  cartRoutes.deleteProduct,
  userAuthMiddleware,
  userIdMiddleware,
  cartController.deleteProduct
);
cartRouter.delete(
  cartRoutes.clear,
  userAuthMiddleware,
  userIdMiddleware,
  cartController.clearCart
);
