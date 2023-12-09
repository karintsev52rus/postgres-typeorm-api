import Jwt from "jsonwebtoken";
import config from "config";
import { Response, Request } from "express";
import { userController } from "../controllers/userController";
import { IAuthRequest } from "../types/userTypes";
import { Role } from "../entity/Role";
import {
  IUserIdPayload,
  IUserAuthData,
  IUserDataRequest,
} from "../types/userTypes";

export const userAuthMiddleware = async (
  req: IUserDataRequest,
  res: Response,
  next: Function
) => {
  try {
    const token = req.headers["authorization"].split(" ")[1];
    if (!token) {
      return res.status(401).send({ message: "ошибка при получении токена" });
    }

    const payload = Jwt.verify(token, config.get("secKey"));
    if (typeof payload === "string") {
      return res.status(401).send({ message: "ошибка при получении токена" });
    }

    const user = await userController.userRepository
      .createQueryBuilder("user")
      .select(["password", "role.name"])
      .innerJoin(Role, "role", "role.role_id = user.role_id")
      .where("user.id = :id", { id: payload.id })
      .getRawOne<IUserAuthData>();

    if (user) {
      if (!user.password === payload.password) {
        return res.status(403).send({ message: "Пароль неверный" });
      } else {
        req.user = { userId: payload.id, role: user.role_name };
        next();
      }
    }
  } catch (error) {
    console.log(error);
    return res.status(401).send({ message: "токен недействителен" });
  }
};

export const userRoleMiddleware = (
  req: IUserDataRequest,
  res: Response,
  next: Function
) => {
  const userRole = req.user.role;
  if (userRole === "admin") {
    next();
  } else {
    res.json("недостаточно прав для данного действия");
  }
};

export const userIdMiddleware = (
  req: IUserDataRequest,
  res: Response,
  next: Function
) => {
  if (req.method === "GET") {
    req.body = { userId: +req.params["id"] };
  }
  const { userId } = req.body;
  if (userId != req.user.userId && req.user.role != "admin") {
    res.json({ message: "недостаточно прав для данной операции" });
    return;
  }
  next();
};
