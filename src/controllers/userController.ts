import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "config";
import { Request, Response } from "express";
import { MyUser } from "../entity/MyUser";
import { AppDataSource } from "../data-source";

import {
  IUserJWTPayload,
  ICreateUserPayload,
  ILoginUserPayload,
} from "../types/userTypes";

class UserController {
  userRepository = AppDataSource.getRepository(MyUser);

  createUser = async (req: ICreateUserPayload, res: Response) => {
    try {
      const { email, password, name } = req.body;
      const lowerEmail = email.toLowerCase();
      const candidates = await this.userRepository.findBy({
        email,
      });

      if (candidates.length > 0) {
        return res
          .status(400)
          .send({ message: `Пользователь с таким email уже зарегистрирован` });
      }

      const hashPassword = await bcrypt.hash(password, 3);
      const user = this.userRepository.create({
        email: lowerEmail,
        name: name,
        password: hashPassword,
      });

      const result = await this.userRepository.save(user);

      return res.json({ message: "новый пользователь создан", result });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Ошибка на сервере" });
    }
  };

  login = async (req: ILoginUserPayload, res: Response) => {
    try {
      const { email, password } = req.body;
      const lowerEmail = email.toLowerCase();
      const user = await this.userRepository.findOneBy({
        email: lowerEmail,
      });

      if (!user) {
        return res
          .status(404)
          .send({ message: "Пользователь с таким логином не найден" });
      }

      const isPassValid = bcrypt.compareSync(password, user.password);
      if (!isPassValid) {
        return res.status(403).send({ message: "Пароль неверный" });
      }

      const jwtPayload: IUserJWTPayload = {
        id: user.id,
        password: user.password,
      };

      const token = jwt.sign(jwtPayload, config.get("secKey"), {
        expiresIn: "24h",
      });

      return res.send({
        token,
        id: user.id,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Ошибка на сервере" });
    }
  };

  getUsers = async (req: Request, res: Response) => {
    try {
      const users = await this.userRepository.find({
        select: { id: true, email: true, name: true },
        relations: ["role_id"],
        order: { id: "ASC" },
      });

      res.json(users);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Ошибка на сервере" });
    }
  };
  getUser = async (req: Request, res: Response) => {
    try {
      const userId = req.params["id"];
      const user = await this.userRepository.find({
        select: { id: true, email: true, name: true },
        relations: ["role_id"],
        where: { id: +userId },
      });

      if (user) {
        res.json(user);
      } else res.json("пользователь с таким id не найден");
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Ошибка на сервере" });
    }
  };
  deleteUser = async (req: Request, res: Response) => {
    try {
      const userId = req.params["id"];
      await this.userRepository.delete({ id: +userId });
      res.json({ message: `Пользователь с id = ${userId} удален` });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Ошибка на сервере" });
    }
  };

  updateUser = async (req: Request, res: Response) => {
    try {
      const userId = req.params["id"];
      const user = await this.userRepository.findOneBy({ id: +userId });

      if (!user) {
        res.json({ message: `пользователь с id = ${userId} не существует` });
        return;
      }

      const newUserData: Partial<MyUser> = {};

      for (const key in req.body) {
        if (req.body[key]) {
          newUserData[key] = req.body[key];
        }
      }

      let password = user.password;
      if (req.body.password) {
        password = await bcrypt.hash(password, 3);
        newUserData.password = password;
      }
      this.userRepository.merge(user, newUserData);
      const newUser = await this.userRepository.save(user);
      res.json({
        message: `пользователь с id = ${userId} изменен`,
        newUser,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Ошибка на сервере" });
    }
  };
}

const userController = new UserController();

export { userController };
