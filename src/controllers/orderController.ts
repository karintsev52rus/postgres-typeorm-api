import { IAuthRequest } from "../types/userTypes";
import { IOrderPayload } from "../types/orderTypes";
import { Response } from "express";
import { cartController } from "./cartController";
const dayjs = require("dayjs");
import { AppDataSource } from "../data-source";
import { MyOrder } from "../entity/Order";
import { IUserIdPayload } from "../types/userTypes";
import { MyOrderProduct } from "../entity/OrderProduct";
import { CartProduct } from "../entity/CartProduct";

class OrderController {
  orderRepository = AppDataSource.getRepository(MyOrder);
  orderProductRepository = AppDataSource.getRepository(MyOrderProduct);
  createOrder = async (req: IAuthRequest<IOrderPayload>, res: Response) => {
    try {
      const { userId } = req.body;
      const datetime = dayjs().format("YYYY-MM-DD HH:mm:ss");
      await this.createOrderQuery(userId, datetime);
      const userOrders = await this.getUserOrdersQuery(userId);
      const lastOrderId = userOrders[0].id;
      await this.addToOrderQuery(userId, lastOrderId);
      cartController.clearCartQuery(userId);

      return res.json({
        message: "новый заказ создан",
        lastOrderId: lastOrderId,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Ошибка на сервере" });
    }
  };

  addToOrderQuery = async (userId: number, orderId: number) => {
    const cartProducts = await cartController.cartRepository
      .createQueryBuilder("cart_product")
      .select([
        `${orderId} as "order_id"`,
        "product_id",
        "product.price as price",
        "amount",
      ])
      .innerJoin("cart_product.product_id", "product")
      .where("user_id = :userId", { userId })
      .getRawMany<CartProduct>();

    await this.orderProductRepository
      .createQueryBuilder("my_order_product")
      .insert()
      .values(cartProducts)
      .execute();
  };

  createOrderQuery = async (userId: number, datetime: Date) => {
    const order = this.orderRepository.create({
      user_id: userId,
      datetime: datetime,
    });
    const result = await this.orderRepository.save(order);
    return result;
  };

  getOrders = async (req: IAuthRequest<IOrderPayload>, res: Response) => {
    try {
      const orders = await this.orderRepository
        .createQueryBuilder()
        .select(["id", "user_id", "datetime"])
        .getRawMany<MyOrder>();

      res.json({ orders });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Ошибка на сервере" });
    }
  };

  getOrder = async (req: IAuthRequest<IOrderPayload>, res: Response) => {
    try {
      const orderId = req.body.orderId;
      const order = await this.getOrderQuery(orderId);
      const orderProducts = await this.getOrderProducts(orderId);
      res.json({ order, orderProducts });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Ошибка на сервере" });
    }
  };

  getOrderQuery = async (orderId: number) => {
    const order = await this.orderRepository
      .createQueryBuilder()
      .select(["id", "user_id", "datetime"])
      .where("id = :orderId", { orderId })
      .getRawOne<MyOrder>();
    return order;
  };

  getOrderProducts = async (orderId: number) => {
    const orderProducts = await this.orderProductRepository
      .createQueryBuilder()
      .select(["id", "product_id", "price", "order_id", "amount"])
      .where("order_id = :orderId", { orderId })
      .getRawMany<MyOrderProduct>();
    return orderProducts;
  };

  getUserOrders = async (req: IAuthRequest<IUserIdPayload>, res: Response) => {
    try {
      const userId = req.user.userId;
      const userOrders = await this.getUserOrdersQuery(userId);
      res.json({ userOrders });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Ошибка на сервере" });
    }
  };

  getUserOrdersQuery = async (userId: number) => {
    const userOrders = await this.orderRepository
      .createQueryBuilder()
      .select(["id", "user_id", "datetime"])
      .where("user_id = :userId", { userId })
      .orderBy("id", "DESC")
      .getRawMany<MyOrder>();
    return userOrders;
  };

  deleteOrder = async (req: IAuthRequest<IOrderPayload>, res: Response) => {
    try {
      const { orderId } = req.body;
      await this.orderProductRepository
        .createQueryBuilder()
        .delete()
        .where("order_id = :orderId", { orderId })
        .execute();
      await this.orderRepository
        .createQueryBuilder()
        .delete()
        .where("id = :orderId", { orderId })
        .execute();
      return res.json({ message: `заказ № ${orderId} удален` });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Ошибка на сервере" });
    }
  };

  updateOrder = async (req: IAuthRequest<IOrderPayload>, res: Response) => {
    try {
      const { orderId, productId, amount } = req.body;
      const orderProduct = await this.getOrderProduct(orderId, productId);
      if (!orderProduct) {
        return res.status(404).json({
          message: `не удалось найти товар id = ${productId} в заказе № ${orderId}`,
        });
      }

      await this.orderProductRepository.update(
        { id: orderProduct.id },
        { amount: amount }
      );
      const newOrderData = await this.getOrderQuery(orderId);
      const newOrderProducts = await this.getOrderProducts(orderId);

      return res.json({
        message: `заказ № ${orderId} обновлен`,
        order: newOrderData,
        orderProducts: newOrderProducts,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Ошибка на сервере" });
    }
  };

  deleteOrderProduct = async (
    req: IAuthRequest<IOrderPayload>,
    res: Response
  ) => {
    try {
      const { orderId, productId } = req.body;

      const orderProduct = await this.getOrderProduct(orderId, productId);
      if (!orderProduct) {
        return res.status(404).json({
          message: `не удалось найти товар id = ${productId} в заказе № ${orderId}`,
        });
      }
      await this.orderProductRepository.delete({ id: orderProduct.id });
      const newOrderData = await this.getOrderQuery(orderId);
      const newOrderProducts = await this.getOrderProducts(orderId);
      return res.json({
        message: `заказ № ${orderId} обновлен`,
        order: newOrderData,
        orderProducts: newOrderProducts,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Ошибка на сервере" });
    }
  };

  getOrderProduct = async (orderId: number, productId: number) => {
    return await this.orderProductRepository
      .createQueryBuilder()
      .select(["id", "product_id", "amount", "order_id"])
      .where("order_id = :orderId", { orderId })
      .andWhere("product_id = :productId", { productId })
      .getRawOne<MyOrderProduct>();
  };
}

export const orderController = new OrderController();
