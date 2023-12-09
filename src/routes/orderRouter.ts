import * as express from "express";
import { orderController } from "../controllers/orderController";
import {
  userAuthMiddleware,
  userRoleMiddleware,
  userIdMiddleware,
} from "../middlewares/authMiddleware";
import { orderIdMiddleware } from "../middlewares/orderIdMiddleware";

export const orderRouter = express.Router();

const orderRoutes = {
  new: "/new",
  all: "/all",
  userOrders: "/user/:id",
  order: "/order/:id",
  delete: "/delete/:id",
  update: "/update",
  deleteProduct: "/delete_product",
};

orderRouter.post(
  orderRoutes.new,
  userAuthMiddleware,
  userIdMiddleware,
  orderController.createOrder
);
orderRouter.get(
  orderRoutes.all,
  userAuthMiddleware,
  userRoleMiddleware,
  orderController.getOrders
);
orderRouter.get(
  orderRoutes.order,
  userAuthMiddleware,
  orderIdMiddleware,
  orderController.getOrder
);

orderRouter.get(
  orderRoutes.userOrders,
  userAuthMiddleware,
  userIdMiddleware,
  orderController.getUserOrders
);

orderRouter.delete(
  orderRoutes.delete,
  userAuthMiddleware,
  userRoleMiddleware,
  orderIdMiddleware,
  orderController.deleteOrder
);

orderRouter.put(
  orderRoutes.update,
  userAuthMiddleware,
  userRoleMiddleware,
  orderIdMiddleware,
  orderController.updateOrder
);

orderRouter.delete(
  orderRoutes.deleteProduct,
  userAuthMiddleware,
  userRoleMiddleware,
  orderIdMiddleware,
  orderController.deleteOrderProduct
);
