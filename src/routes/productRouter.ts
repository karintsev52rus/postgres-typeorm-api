import * as express from "express";
import { productController } from "../controllers/productController";

export const productRouter = express.Router();

const productRoutes = {
  products: "/",
  product: "/:id",
  create: "/create",
  update: "/update/:id",
  delete: "/delete/:id",
};

productRouter.get(productRoutes.products, productController.getProducts);
productRouter.get(productRoutes.product, productController.getProduct);
productRouter.post(productRoutes.create, productController.createProduct);
productRouter.put(productRoutes.update, productController.updateProduct);
productRouter.delete(productRoutes.delete, productController.deleteProduct);
