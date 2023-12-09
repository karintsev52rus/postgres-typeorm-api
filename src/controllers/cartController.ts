import { Request, Response } from "express";
import { CartProduct } from "../entity/CartProduct";
import { AppDataSource } from "../data-source";
import { IUpdateCartPayload } from "../types/cartTypes";
import { IAuthRequest } from "../types/userTypes";

class CartController {
  cartRepository = AppDataSource.getRepository(CartProduct);

  getCartQuery = async (userId: number) => {
    return await this.cartRepository
      .createQueryBuilder()
      .select(["id", "user_id", "product_id", "amount"])
      .where("user_id = :userId", { userId })
      .getRawMany<CartProduct>();
  };

  getCartProduct = async (userId: number, productId: number) => {
    return await this.cartRepository
      .createQueryBuilder()
      .select(["id", "user_id", "product_id", "amount"])
      .where("user_id = :userId", { userId })
      .andWhere("product_id = :productId", { productId })
      .getRawOne<CartProduct>();
  };

  getCart = async (req: IAuthRequest<IUpdateCartPayload>, res: Response) => {
    try {
      const { userId } = req.body;
      const userCartProducts = await this.getCartQuery(userId);
      res.json(userCartProducts);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Ошибка на сервере" });
    }
  };

  updateCart = async (req: IAuthRequest<IUpdateCartPayload>, res: Response) => {
    try {
      const { userId, productId, amount } = req.body;
      console.log(req.body);

      const cartProduct = await this.getCartProduct(userId, productId);

      if (cartProduct) {
        const cartProductId = cartProduct.id;
        await this.cartRepository.update({ id: cartProductId }, { amount });
        const newUserCart = await this.getCartQuery(userId);
        return res.json({
          newUserCart,
          message: `корзина user_id = ${userId} обновлена`,
        });
      } else {
        await this.cartRepository.insert({
          user_id: userId,
          product_id: productId,
          amount,
        });
        const newUserCart = await this.getCartQuery(userId);
        return res.json({
          newUserCart,
          message: `товар id = ${productId} добавлен в корзину пользователя user_id = ${userId}`,
        });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Ошибка на сервере" });
    }
  };

  deleteCartProduct = async (userId: number, productId: number) => {
    const cartProduct = await this.getCartProduct(userId, productId);
    if (cartProduct) {
      await this.cartRepository.delete({ id: cartProduct.id });
    }
  };

  deleteProduct = async (
    req: IAuthRequest<IUpdateCartPayload>,
    res: Response
  ) => {
    try {
      const { userId, productId } = req.body;
      const result = await this.deleteCartProduct(userId, productId);
      const newCart = await this.getCartQuery(userId);

      return res.json({ message: result, newCart });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Ошибка на сервере" });
    }
  };

  clearCart = async (req: IAuthRequest<IUpdateCartPayload>, res: Response) => {
    try {
      const { userId } = req.body;
      await this.clearCartQuery(userId);
      return res.json({
        message: `корзина пользователя id = ${userId} очищена`,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Ошибка на сервере" });
    }
  };

  clearCartQuery = async (userId: number) => {
    return await this.cartRepository
      .createQueryBuilder()
      .delete()
      .where("cart_product.user_id = :userId", { userId })
      .execute();
  };
}

const cartController = new CartController();
export { cartController };
