import * as express from "express";
import { userController } from "../controllers/userController";
import {
  userAuthMiddleware,
  userRoleMiddleware,
  userIdMiddleware,
} from "../middlewares/authMiddleware";

export const userRouter = express.Router();

const userRoutes = {
  createUser: "/create_user",
  getUsers: "/get_users",
  getUser: "/get_user/:id",
  login: "/login",
  delete: "/delete/:id",
  update: "/update/:id",
};

userRouter.post(userRoutes.createUser, userController.createUser);
userRouter.post(userRoutes.login, userController.login);
userRouter.get(
  userRoutes.getUsers,
  userAuthMiddleware,
  userRoleMiddleware,
  userController.getUsers
);
userRouter.get(
  userRoutes.getUser,
  userAuthMiddleware,
  userIdMiddleware,
  userController.getUser
);
userRouter.delete(
  userRoutes.delete,
  userAuthMiddleware,
  userIdMiddleware,
  userController.deleteUser
);
userRouter.put(
  userRoutes.update,
  userAuthMiddleware,
  userIdMiddleware,
  userController.updateUser
);
