import { IUserDataRequest } from "../types/userTypes";
import { Response } from "express";
import { orderController } from "../controllers/orderController";

export const orderIdMiddleware = async (
  req: IUserDataRequest,
  res: Response,
  next: Function
) => {
  try {
    const params = +req.params;
    if (!isNaN(params) && (req.method === "GET" || req.method === "DELETE")) {
      req.body = { orderId: +req.params["id"] };
    }
    const { orderId } = req.body;

    const order = await orderController.getOrderQuery(orderId);
    if (!order) {
      return res
        .status(404)
        .json({ message: `заказа с номером ${orderId} не существует` });
    }

    if (order.user_id != req.user.userId && req.user.role != "admin") {
      res.json({ message: "недостаточно прав для данной операции" });
      return;
    }
    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Ошибка на сервере" });
  }
};
