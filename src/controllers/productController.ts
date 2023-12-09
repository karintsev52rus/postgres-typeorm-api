import { AppDataSource } from "../data-source";
import { Product } from "../entity/Products";
import { Request, Response } from "express";
import {
  INewProductPayload,
  IUpdateProductPayload,
} from "../types/productTypes";

class ProductController {
  productRepository = AppDataSource.getRepository(Product);

  getProducts = async (req: Request, res: Response) => {
    try {
      const products = await this.productRepository.find({
        select: { id: true, title: true, price: true },
        relations: ["brand_id", "type_id"],
        order: { id: "ASC" },
      });

      res.json(products);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Ошибка на сервере" });
    }
  };

  getProduct = async (req: Request, res: Response) => {
    try {
      const productId = req.params["id"];
      const product = await this.productRepository.find({
        select: { id: true, title: true, price: true },
        relations: ["brand_id", "type_id"],
        where: { id: +productId },
      });
      res.json(product);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Ошибка на сервере" });
    }
  };

  createProduct = async (req: INewProductPayload, res: Response) => {
    try {
      const product = this.productRepository.create(req.body);
      const result = await this.productRepository.save(product);
      console.log(result);
      res.json({ message: "товар создан", product });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Ошибка на сервере" });
    }
  };

  updateProduct = async (req: IUpdateProductPayload, res: Response) => {
    try {
      const productId = req.params["id"];
      const product = await this.productRepository.findOneBy({
        id: +productId,
      });

      if (!product) {
        res.json({ message: `товар с id = ${productId} не существует` });
        return;
      }

      const newProductData = req.body;
      this.productRepository.merge(product, newProductData);
      const newProduct = await this.productRepository.save(product);
      res.json({
        message: `Товар с id = ${productId} изменен`,
        newProduct,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Ошибка на сервере" });
    }
  };

  deleteProduct = async (req: Request, res: Response) => {
    try {
      const productId = req.params["id"];
      await this.productRepository.delete(productId);
      res.json({ message: `товар с id = ${productId} удален` });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Ошибка на сервере" });
    }
  };
}

const productController = new ProductController();

export { productController };
